from sqlalchemy import Column, Integer, String, Boolean
from src.config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Nullable for Google Auth users
    is_premium = Column(Boolean, default=False)
    checks_count = Column(Integer, default=0)
    google_id = Column(String, unique=True, index=True, nullable=True)
