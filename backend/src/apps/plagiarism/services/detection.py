import os
import faiss
import pandas as pd
from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
from src.config.settings import settings
from src.apps.plagiarism.exceptions import EmptyTextException, MLComponentsNotLoadedException
from src.apps.plagiarism.schemas.plagiarism import CheckRequest, CheckResponse, FlaggedSentence, HistoryItemResponse
from fastapi import HTTPException
from src.apps.plagiarism.model.history import DetectionHistory
from src.apps.plagiarism.model.guest_limit import GuestLimit
from src.apps.plagiarism.repositories.history import HistoryRepository
from src.config.database import async_session_maker
from src.apps.auth.model.user import User
from sqlalchemy import select

class DetectionService:
    model = None
    index = None
    texts_db = None

    @classmethod
    def load_components(cls):
        try:
            if os.path.exists(settings.MODEL_PATH):
                print(f"Loading model from {settings.MODEL_PATH}...")
                cls.model = SentenceTransformer(settings.MODEL_PATH)
            else:
                print(f"Warning: Model not found at {settings.MODEL_PATH}. Using base model.")
                cls.model = SentenceTransformer('tahrirchi/tahrirchi-bert-base')

            if os.path.exists(settings.FAISS_INDEX_PATH):
                print(f"Loading FAISS index from {settings.FAISS_INDEX_PATH}...")
                cls.index = faiss.read_index(settings.FAISS_INDEX_PATH)
            else:
                print(f"Warning: FAISS index not found. Creating dummy.")
                cls.index = faiss.IndexFlatIP(768)

            if os.path.exists(settings.TEXTS_CSV_PATH):
                print(f"Loading texts mapping from {settings.TEXTS_CSV_PATH}...")
                cls.texts_db = pd.read_csv(settings.TEXTS_CSV_PATH)
            else:
                print(f"Warning: Texts CSV not found.")
                cls.texts_db = pd.DataFrame(columns=['id', 'text', 'source_document'])
        except Exception as e:
            print(f"Error loading ML components: {str(e)}")

    def __init__(self):
        self.repo = HistoryRepository()

    async def check_plagiarism(self, request: CheckRequest, user_id: str | None, client_ip: str) -> CheckResponse:
        if not request.text.strip():
            raise EmptyTextException()

        # Enforce Limits
        if not user_id:
            guest_limit = await GuestLimit.find_one({"ip_address": client_ip})
            if guest_limit:
                if guest_limit.count >= 5:
                    raise HTTPException(status_code=403, detail="Free guest limit exceeded. Please sign in.")
                guest_limit.count += 1
                await guest_limit.save()
            else:
                guest_limit = GuestLimit(ip_address=client_ip, count=1)
                await guest_limit.save()
        else:
            async with async_session_maker() as session:
                stmt = select(User).where(User.id == int(user_id))
                result = await session.execute(stmt)
                user = result.scalar_one_or_none()
                if user:
                    if not user.is_premium:
                        if user.checks_count >= 5:
                            raise HTTPException(status_code=403, detail="Free tier limit exceeded. Please upgrade to premium.")
                        user.checks_count += 1
                        await session.commit()
            
        if self.model is None or self.index is None or self.texts_db is None:
            raise MLComponentsNotLoadedException()

        sentences = sent_tokenize(request.text)
        if not sentences:
             return CheckResponse(
                id="0",
                plagiarism_percentage=0.0,
                total_sentences=0,
                flagged_sentences_count=0,
                flagged_sentences=[]
            )

        embeddings = self.model.encode(sentences, convert_to_numpy=True, normalize_embeddings=True)
        distances, indices = self.index.search(embeddings, 1)

        threshold = 0.85
        flagged = []
        
        for i, (dist, idx) in enumerate(zip(distances, indices)):
            best_score = float(dist[0])
            best_idx = int(idx[0])
            
            if best_score >= threshold and best_idx != -1:
                try:
                    if best_idx < len(self.texts_db):
                        row = self.texts_db.iloc[best_idx]
                        source_doc = "Unknown Document"
                        source_text = ""
                        
                        if 'text' in row and 'source_document' in row:
                            source_doc = str(row['source_document'])
                            source_text = str(row['text'])
                        elif len(row) > 0:
                            val = str(row.iloc[0])
                            if val.startswith('[') and ']' in val:
                                parts = val.split(']', 1)
                                source_doc = parts[0][1:]
                                source_text = parts[1].strip()
                            else:
                                source_text = val
                                
                        flagged.append(FlaggedSentence(
                            original_sentence=sentences[i],
                            source_text=source_text,
                            confidence_score=round(best_score * 100, 2),
                            source_document=source_doc
                        ))
                except Exception as e:
                    print(f"Error retrieving text for index {best_idx}: {str(e)}")

        plagiarism_percentage = (len(flagged) / len(sentences)) * 100 if sentences else 0.0

        history = DetectionHistory(
            user_id=user_id,
            input_text=request.text,
            plagiarism_percentage=round(plagiarism_percentage, 2),
            total_sentences=len(sentences),
            flagged_sentences_count=len(flagged),
            flagged_sentences=[f.model_dump() for f in flagged]
        )
        
        saved_history = await self.repo.create(history)

        return CheckResponse(
            id=str(saved_history.id),
            plagiarism_percentage=saved_history.plagiarism_percentage,
            total_sentences=saved_history.total_sentences,
            flagged_sentences_count=saved_history.flagged_sentences_count,
            flagged_sentences=flagged
        )

    async def get_user_history(self, user_id: str) -> list[HistoryItemResponse]:
        histories = await self.repo.get_by_user_id(user_id)
        return [
            HistoryItemResponse(
                id=str(h.id),
                plagiarism_percentage=h.plagiarism_percentage,
                created_at=h.created_at,
                text_snippet=h.input_text[:100] + ("..." if len(h.input_text) > 100 else "")
            )
            for h in histories
        ]

    async def add_source(self, text: str, source_document: str) -> dict:
        if self.model is None or self.index is None or self.texts_db is None:
            raise MLComponentsNotLoadedException()
            
        sentences = sent_tokenize(text)
        if not sentences:
            raise EmptyTextException()
            
        # Embed sentences
        embeddings = self.model.encode(sentences, convert_to_numpy=True, normalize_embeddings=True)
        
        # Add to FAISS index
        self.index.add(embeddings)
        faiss.write_index(self.index, settings.FAISS_INDEX_PATH)
        
        # Append to CSV
        new_rows = []
        for s in sentences:
            new_rows.append({
                'id': len(self.texts_db) + len(new_rows),
                'text': s,
                'source_document': source_document
            })
            
        new_df = pd.DataFrame(new_rows)
        self.texts_db = pd.concat([self.texts_db, new_df], ignore_index=True)
        self.texts_db.to_csv(settings.TEXTS_CSV_PATH, index=False)
        
        return {"message": f"Successfully added {len(sentences)} sentences to the database."}
