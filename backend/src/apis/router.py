from fastapi import APIRouter
from src.apis.auth_router import router as auth_router
from src.apis.plagiarism_router import router as plagiarism_router
from src.apis.checkout_router import router as checkout_router
from src.apis.admin_router import router as admin_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(plagiarism_router)
api_router.include_router(checkout_router)
api_router.include_router(admin_router)
