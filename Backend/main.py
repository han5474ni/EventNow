import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

import models, schemas
from database import engine, get_db
from config import settings
from security import get_password_hash

# Import all routes
from routes import auth, event, comment, registration, recommendation, password_reset, email_verification, user, static_test, admin

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="EventNow API",
    description="API for EventNow - A platform for discovering and managing campus events",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router)
app.include_router(event.router)
app.include_router(comment.router)
app.include_router(registration.router)
app.include_router(recommendation.router)
app.include_router(password_reset.router)
app.include_router(email_verification.router)
app.include_router(user.router)
app.include_router(static_test.router)
app.include_router(admin.router)

# Create static files directory for event images
os.makedirs("static/event_images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to EventNow API",
        "docs": "/api/docs",
        "redoc": "/api/redoc",
    }

# Create first admin user if it doesn't exist
@app.on_event("startup")
def create_first_admin():
    db = next(get_db())
    try:
        admin = db.query(models.User).filter(models.User.email == settings.FIRST_ADMIN_EMAIL).first()
        if not admin:
            hashed_password = get_password_hash(settings.FIRST_ADMIN_PASSWORD)
            admin_user = models.User(
                email=settings.FIRST_ADMIN_EMAIL,
                hashed_password=hashed_password,
                full_name=settings.FIRST_ADMIN_FULLNAME,
                role=models.UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("Created first admin user")
    except Exception as e:
        print(f"Error creating first admin: {e}")
    finally:
        db.close()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}