from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models, schemas
from database import get_db
from security import get_current_active_user
from services.recommendation_service import get_recommended_events

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/events", response_model=List[schemas.Event])
def get_recommendations(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Get recommended events based on user's registration history."""
    recommended_events = get_recommended_events(db, current_user.id, limit)
    return recommended_events

@router.get("/similar-events/{event_id}", response_model=List[schemas.Event])
def get_similar_events(
    event_id: int,
    limit: int = 5,
    db: Session = Depends(get_db),
):
    """Get events similar to the specified event."""
    # Check if the event exists
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Get similar events based on category and tags
    similar_events = (
        db.query(models.Event)
        .filter(
            models.Event.id != event_id,
            models.Event.category == event.category,
            models.Event.start_datetime > datetime.utcnow(),
        )
        .order_by(models.Event.start_datetime.asc())
        .limit(limit)
        .all()
    )
    
    return similar_events
