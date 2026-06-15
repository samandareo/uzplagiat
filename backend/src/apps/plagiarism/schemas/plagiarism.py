from pydantic import BaseModel
from typing import List
from datetime import datetime

class CheckRequest(BaseModel):
    text: str

class FlaggedSentence(BaseModel):
    original_sentence: str
    source_text: str
    confidence_score: float
    source_document: str

class CheckResponse(BaseModel):
    id: str
    plagiarism_percentage: float
    total_sentences: int
    flagged_sentences_count: int
    flagged_sentences: List[FlaggedSentence]

class HistoryItemResponse(BaseModel):
    id: str
    plagiarism_percentage: float
    created_at: datetime
    text_snippet: str
