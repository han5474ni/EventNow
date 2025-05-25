from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models, schemas
from database import get_db
from security import get_current_active_user
from services.notification_service import send_registration_notification_email

router = APIRouter(prefix="/api/registrations", tags=["Registrations"])

@router.post("/", response_model=schemas.Registration, status_code=status.HTTP_201_CREATED)
async def register_for_event(
    registration: schemas.RegistrationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Register the current user for an event."""
    # Check if event exists
    event = db.query(models.Event).filter(models.Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if registration is open
    if not event.is_registration_open:
        raise HTTPException(status_code=400, detail="Registration for this event is closed")
    
    # Check if there are available slots
    if event.available_slots <= 0:
        raise HTTPException(status_code=400, detail="No available slots for this event")
    
    # Check if user is already registered
    existing_registration = (
        db.query(models.Registration)
        .filter(
            models.Registration.user_id == current_user.id,
            models.Registration.event_id == registration.event_id,
        )
        .first()
    )
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    # Create new registration
    db_registration = models.Registration(
        user_id=current_user.id,
        event_id=registration.event_id,
        status=models.RegistrationStatus.CONFIRMED,
    )
    
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    
    # Send email notification to event organizer
    try:
        await send_registration_notification_email(background_tasks, db_registration)
        print(f"Registration notification email sent to event organizer")
    except Exception as e:
        # Log the error but don't fail the request
        print(f"Error sending registration notification email: {e}")
    
    return db_registration

@router.get("/my-registrations", response_model=List[schemas.RegistrationWithEvent])
def get_my_registrations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Get all registrations for the current user."""
    return (
        db.query(models.Registration)
        .filter(models.Registration.user_id == current_user.id)
        .order_by(models.Registration.registration_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Cancel a registration. Only the registrant or an admin can cancel."""
    registration = db.query(models.Registration).filter(models.Registration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    # Check if the current user is the registrant or an admin
    if not current_user.is_admin and registration.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this registration",
        )
    
    # Check if the event has already started
    if registration.event.start_datetime < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel registration for an event that has already started",
        )
    
    db.delete(registration)
    db.commit()
    return None
