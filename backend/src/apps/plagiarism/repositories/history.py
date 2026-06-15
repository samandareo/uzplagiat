from typing import List
from src.apps.plagiarism.model.history import DetectionHistory

class HistoryRepository:
    async def create(self, history: DetectionHistory) -> DetectionHistory:
        await history.insert()
        return history

    async def get_by_user_id(self, user_id: str) -> List[DetectionHistory]:
        return await DetectionHistory.find(DetectionHistory.user_id == user_id).sort(-DetectionHistory.created_at).to_list()
