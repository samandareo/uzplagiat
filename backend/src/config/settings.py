import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "UzPlagiat API"
    VERSION: str = "1.0.0"
    
    # Postgres
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/uzplagiat_auth"
    
    # Mongo
    MONGO_URL: str = "mongodb://admin:password@localhost:27017"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    
    # ML Models
    MODEL_PATH: str = "./my_model"
    FAISS_INDEX_PATH: str = "plagiarism_db.index"
    TEXTS_CSV_PATH: str = "plagiarism_db_texts.csv"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
