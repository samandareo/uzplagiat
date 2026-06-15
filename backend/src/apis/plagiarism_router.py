from fastapi import APIRouter, Depends, Request
from typing import List
from src.core.security import get_current_user_id, get_optional_user_id
from src.apps.plagiarism.schemas.plagiarism import CheckRequest, CheckResponse, HistoryItemResponse
from src.apps.plagiarism.services.detection import DetectionService

router = APIRouter(prefix="/plagiarism", tags=["plagiarism"])

# Inject DetectionService to avoid recreating it on every request
def get_detection_service():
    return DetectionService()

@router.post("/check", response_model=CheckResponse)
async def check_plagiarism(
    request: Request,
    body: CheckRequest, 
    user_id: str | None = Depends(get_optional_user_id),
    service: DetectionService = Depends(get_detection_service)
):
    client_ip = request.client.host if request.client else "unknown"
    return await service.check_plagiarism(body, user_id, client_ip)

@router.get("/history", response_model=List[HistoryItemResponse])
async def get_history(
    user_id: str = Depends(get_current_user_id),
    service: DetectionService = Depends(get_detection_service)
):
    return await service.get_user_history(user_id)
