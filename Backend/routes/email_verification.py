from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
import models, schemas
from services.email import send_verification_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/verify-email/send", response_model=schemas.email_verification.EmailVerificationResponse)
async def send_verification_email_route(request: schemas.email_verification.EmailVerificationRequest, db: Session = Depends(get_db)):
    """Send a verification email to the user"""
    # Find the user by email
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        return {"message": "Email already verified"}
    
    # Delete any existing verification tokens for this user
    db.query(models.EmailVerification).filter(models.EmailVerification.user_id == user.id).delete()
    
    # Create a new verification token
    verification_token = models.EmailVerification.create_token(user.id, user.email)
    db.add(verification_token)
    db.commit()
    
    # Send verification email
    await send_verification_email(user.email, user.full_name, verification_token.token)
    
    return {"message": "Verification email sent successfully"}

@router.get("/verify-email/{token}", response_model=schemas.email_verification.EmailVerificationResponse)
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify a user's email using the verification token"""
    verification = db.query(models.EmailVerification).filter(models.EmailVerification.token == token).first()
    
    if not verification or not verification.is_valid():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    if verification.is_verified:
        return {"message": "Email already verified"}
    
    # Get the user
    user = db.query(models.User).filter(models.User.id == verification.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Mark email as verified
    user.email_verified = True
    verification.is_verified = True
    
    db.add(user)
    db.add(verification)
    db.commit()
    
    return {"message": "Email verified successfully"}
