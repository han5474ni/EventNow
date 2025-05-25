from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import models, schemas
from database import get_db
from security import (
    get_password_hash,
    create_access_token,
    get_current_user,
    get_current_active_user,
    oauth2_scheme,
    pwd_context,
    verify_password
)
from config import settings
from services.email import send_verification_email, send_welcome_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
async def register(
    user_data: schemas.UserCreate, db: Session = Depends(get_db)
):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = models.User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=models.UserRole.GENERAL,
        email_verified=False  # Default is False, but being explicit
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create email verification token
    verification_token = models.EmailVerification.create_token(db_user.id, db_user.email)
    db.add(verification_token)
    db.commit()
    
    # Send verification email asynchronously
    await send_verification_email(db_user.email, db_user.full_name, verification_token.token)
    
    # Also send welcome email
    await send_welcome_email(db_user.email, db_user.full_name)
    
    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.LoginResponse)
async def login(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db),
):
    """Login user and return access token and user info."""
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Check if email is verified - only if verification is required
    if settings.REQUIRE_EMAIL_VERIFICATION and not user.email_verified:
        # Create a new verification token if needed
        verification = db.query(models.EmailVerification).filter(
            models.EmailVerification.user_id == user.id,
            models.EmailVerification.is_verified == False
        ).first()
        
        if not verification or not verification.is_valid():
            # Create a new token if none exists or the existing one is expired
            if verification:
                db.delete(verification)
                db.commit()
            
            verification_token = models.EmailVerification.create_token(user.id, user.email)
            db.add(verification_token)
            db.commit()
            
            # Send a new verification email
            await send_verification_email(user.email, user.full_name, verification_token.token)
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. A verification link has been sent to your email address."
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Convert user model to dictionary for response
    user_dict = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "email_verified": user.email_verified
    }
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_dict
    }

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    """Get current user's profile."""
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
async def update_user_me(
    user_update: schemas.UserBase,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile."""
    current_user.full_name = user_update.full_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_data: schemas.ChangePassword,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Change current user's password."""
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )
    
    hashed_password = get_password_hash(password_data.new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    db.commit()
    
    return None
