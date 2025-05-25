from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
from schemas import user_schema, registration_schema
from database import get_db
from security import get_current_active_user, get_password_hash

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=user_schema.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@router.get("/me/registrations", response_model=List[registration_schema.Registration])
async def get_user_registrations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Get all registrations for the current user."""
    # Query registrations for the current user
    registrations = (
        db.query(models.Registration)
        .filter(models.Registration.user_id == current_user.id)
        .all()
    )
    return registrations

@router.put("/me", response_model=user_schema.UserResponse)
async def update_user_profile(
    user_update: user_schema.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Update current user profile."""
    # Get the current user from database to ensure we have the latest data
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields if provided in the request
    if user_update.name is not None:
        db_user.name = user_update.name
    if user_update.email is not None:
        # Check if email is already used by another user
        existing_user = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user.email = user_update.email
    if user_update.password is not None and user_update.password != "":
        db_user.hashed_password = get_password_hash(user_update.password)
    if user_update.bio is not None:
        db_user.bio = user_update.bio
    if user_update.profile_image is not None:
        db_user.profile_image = user_update.profile_image
    
    # Commit changes to database
    db.commit()
    db.refresh(db_user)
    
    return db_user
