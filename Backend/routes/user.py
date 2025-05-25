from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
from schemas import user_schema, registration_schema
from database import get_db
from security import get_current_active_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=user_schema.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@router.get("/me/registrations", response_model=List[registration_schema.Registration])
def get_user_registrations(
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
