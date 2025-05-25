from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
import models, schemas
from security import get_password_hash
from services.email import send_password_reset_email
from schemas.password_reset import ForgotPassword
from schemas.password_reset import ResetPassword

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(request: schemas.password_reset.ForgotPassword, db: Session = Depends(get_db)):
    """Request a password reset link"""
    # Find the user by email
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    # If user exists and is active, create a password reset token
    if user and user.is_active:
        # Delete any existing tokens for this user
        db.query(models.PasswordReset).filter(models.PasswordReset.user_id == user.id).delete()
        
        # Create a new token
        reset_token = models.PasswordReset.create_token(user.id)
        db.add(reset_token)
        db.commit()
        
        # Send email with reset link
        await send_password_reset_email(user.email, user.full_name, reset_token.token)
    
    # Always return 204 No Content to prevent email enumeration
    return None

@router.get("/reset-password/validate/{token}", status_code=status.HTTP_200_OK)
async def validate_reset_token(token: str, db: Session = Depends(get_db)):
    """Validate a password reset token"""
    reset_token = db.query(models.PasswordReset).filter(models.PasswordReset.token == token).first()
    
    if not reset_token or not reset_token.is_valid():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    return {"valid": True}

@router.post("/reset-password/{token}", status_code=status.HTTP_200_OK)
async def reset_password(token: str, request: schemas.password_reset.ResetPassword, db: Session = Depends(get_db)):
    """Reset password using a valid token"""
    reset_token = db.query(models.PasswordReset).filter(models.PasswordReset.token == token).first()
    
    if not reset_token or not reset_token.is_valid():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Get the user
    user = db.query(models.User).filter(models.User.id == reset_token.user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found or inactive"
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    
    # Delete the token
    db.delete(reset_token)
    db.commit()
    
    return {"message": "Password reset successful"}
