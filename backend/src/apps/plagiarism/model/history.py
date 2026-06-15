from beanie import Document
from pydantic import Field
from typing import List, Dict, Any
from datetime import datetime

class DetectionHistory(Document):
    user_id: str
    input_text: str
    plagiarism_percentage: float
    total_sentences: int
    flagged_sentences_count: int
    flagged_sentences: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "detection_histories"
