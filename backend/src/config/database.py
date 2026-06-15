from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.config.settings import settings

# --- PostgreSQL Setup (SQLAlchemy) ---
engine = create_async_engine(settings.DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

# --- MongoDB Setup (Beanie/Motor) ---
async def init_mongo():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client.uzplagiat_data
    # We must import all document models here to pass them to Beanie
    from src.apps.plagiarism.model.history import DetectionHistory
    from src.apps.plagiarism.model.guest_limit import GuestLimit
    await init_beanie(database=db, document_models=[DetectionHistory, GuestLimit])
