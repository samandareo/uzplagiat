from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.apps.plagiarism.services.detection import DetectionService

router = APIRouter(prefix="/admin", tags=["admin"])

class UploadSourceRequest(BaseModel):
    text: str
    source_document: str

# Inject DetectionService
def get_detection_service():
    return DetectionService()

@router.post("/upload-source")
async def upload_source(
    request: UploadSourceRequest,
    service: DetectionService = Depends(get_detection_service)
):
    """
    Open endpoint for adding new source texts to the FAISS index and CSV database.
    (Admin authentication should be added here in production)
    """
    try:
        result = await service.add_source(request.text, request.source_document)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
