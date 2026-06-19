from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import nltk

from src.config.settings import settings
from src.config.database import engine, Base, init_mongo
from src.apis.router import api_router
from src.core.exceptions import NotFoundException, BadRequestException
from src.apps.plagiarism.services.detection import DetectionService

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://uzplagiat.samandareo.uz",
        "http://uzplagiat.samandareo.uz",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(NotFoundException)
async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(BadRequestException)
async def bad_request_exception_handler(request: Request, exc: BadRequestException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

# Startup Event
@app.on_event("startup")
async def startup_event():
    print("Initializing Database Connections...")
    # Initialize Postgres tables
    async with engine.begin() as conn:
        # Warning: For production, use Alembic for migrations instead of create_all
        await conn.run_sync(Base.metadata.create_all)
        
    # Initialize MongoDB Beanie
    await init_mongo()
    print("Database connections established.")

    # Make sure NLTK is downloaded (also handled in Dockerfile, but good for local dev)
    try:
        nltk.data.find('tokenizers/punkt')
        nltk.data.find('tokenizers/punkt_tab')
    except Exception:
        nltk.download('punkt', quiet=True)
        nltk.download('punkt_tab', quiet=True)
        
    print("Loading ML Models...")
    DetectionService.load_components()
    print("ML Models loaded.")

# Include routers
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
