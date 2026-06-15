from sqlalchemy.ext.asyncio import AsyncSession
from src.apps.auth.schemas.user import UserCreate, UserLogin, GoogleAuth, Token
from src.apps.auth.model.user import User
from src.apps.auth.repositories.user import UserRepository
from src.apps.auth.exceptions import UserAlreadyExistsException, InvalidCredentialsException
from src.core.security import get_password_hash, verify_password, create_access_token
import httpx
from src.config.settings import settings

class AuthService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def register_user(self, user_in: UserCreate) -> User:
        existing_user = await self.repo.get_by_email(user_in.email)
        if existing_user:
            raise UserAlreadyExistsException()
        
        hashed_password = get_password_hash(user_in.password)
        user = User(email=user_in.email, hashed_password=hashed_password)
        return await self.repo.create(user)

    async def authenticate_user(self, user_in: UserLogin) -> Token:
        user = await self.repo.get_by_email(user_in.email)
        if not user or not user.hashed_password:
            raise InvalidCredentialsException()
        
        if not verify_password(user_in.password, user.hashed_password):
            raise InvalidCredentialsException()
        
        access_token = create_access_token(data={"sub": str(user.id)})
        return Token(access_token=access_token, token_type="bearer")

    async def authenticate_google_code(self, code: str, redirect_uri: str) -> Token:
        async with httpx.AsyncClient() as client:
            # 1. Exchange the authorization code for tokens
            token_data = {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri
            }
            token_resp = await client.post("https://oauth2.googleapis.com/token", data=token_data)
            if token_resp.status_code != 200:
                print("Google Token Exchange Error:", token_resp.text)
                raise InvalidCredentialsException()
                
            tokens = token_resp.json()
            id_token = tokens.get("id_token")

            # 2. Verify the id_token
            resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
            if resp.status_code != 200:
                raise InvalidCredentialsException()
            
            user_info = resp.json()
            
            if user_info.get("aud") != settings.GOOGLE_CLIENT_ID:
                raise InvalidCredentialsException()
            
            email = user_info.get("email")
            google_id = user_info.get("sub")
            
            # Check if user exists by google_id
            user = await self.repo.get_by_google_id(google_id)
            if not user:
                # Check if user exists by email
                user = await self.repo.get_by_email(email)
                if user:
                    # Link google account
                    user.google_id = google_id
                    await self.repo.session.commit()
                else:
                    # Create new user
                    user = User(email=email, google_id=google_id, is_premium=False)
                    user = await self.repo.create(user)
                    
            access_token = create_access_token(data={"sub": str(user.id)})
            return Token(access_token=access_token, token_type="bearer")
