from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
import urllib.parse
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.database import get_db
from src.apps.auth.schemas.user import UserCreate, UserLogin, UserResponse, Token, GoogleAuth
from pydantic import BaseModel
from src.apps.auth.services.auth import AuthService
from src.core.security import get_current_user_id

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.register_user(user_in)

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.authenticate_user(user_in)

@router.get("/google/login")
async def google_login_redirect(request: Request):
    from src.config.settings import settings
    redirect_uri = f"{settings.BACKEND_URL}/api/auth/google/callback"
    
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

@router.get("/google/callback")
async def google_callback(code: str, request: Request, db: AsyncSession = Depends(get_db)):
    from src.config.settings import settings
    redirect_uri = f"{settings.BACKEND_URL}/api/auth/google/callback"
    
    auth_service = AuthService(db)
    token = await auth_service.authenticate_google_code(code, redirect_uri)
    
    return RedirectResponse(f"{settings.FRONTEND_URL}/auth-success?token={token.access_token}")

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    from src.apps.auth.model.user import User
    user = await db.get(User, int(user_id))
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user_id, 
        "email": user.email, 
        "is_premium": user.is_premium,
        "checks_count": user.checks_count,
        "subscribed_at": user.subscribed_at.isoformat() if user.subscribed_at else None
    }

from pydantic import BaseModel, Field

class UpdatePasswordRequest(BaseModel):
    new_password: str = Field(..., max_length=72)

@router.post("/update-password")
async def update_password(
    data: UpdatePasswordRequest, 
    user_id: str = Depends(get_current_user_id), 
    db: AsyncSession = Depends(get_db)
):
    from src.apps.auth.model.user import User
    from src.core.security import get_password_hash
    user = await db.get(User, int(user_id))
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = get_password_hash(data.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}
