from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

import models

def get_recommended_events(
    db: Session,
    user_id: int,
    limit: int = 10,
) -> List[models.Event]:
    """
    Get recommended events for a user based on their registration history.
    
    This function implements a simple recommendation algorithm that:
    1. Looks at categories of events the user has registered for
    2. Finds upcoming events in those categories
    3. Sorts by relevance (category match) and date (soonest first)
    """
    # Get categories of events the user has registered for
    user_categories = (
        db.query(models.Event.category)
        .join(models.Registration)
        .filter(
            models.Registration.user_id == user_id,
            models.Event.start_datetime > datetime.utcnow() - timedelta(days=180),  # Last 6 months
        )
        .distinct()
        .all()
    )
    
    # Extract category values from the result
    categories = [cat for (cat,) in user_categories] if user_categories else None
    
    # If user has no registration history, return popular upcoming events
    if not categories:
        return get_popular_events(db, limit=limit)
    
    # Find upcoming events in the user's preferred categories
    recommended = (
        db.query(models.Event)
        .filter(
            models.Event.start_datetime > datetime.utcnow(),
            models.Event.category.in_(categories),
        )
        .order_by(
            models.Event.start_datetime.asc()  # Soonest first
        )
        .limit(limit * 2)  # Get extra in case some are filtered out
        .all()
    )
    
    # If not enough recommendations, add some popular events
    if len(recommended) < limit:
        extra_needed = limit - len(recommended)
        popular_events = get_popular_events(db, limit=extra_needed, exclude_ids=[e.id for e in recommended])
        recommended.extend(popular_events)
    
    return recommended[:limit]

def get_popular_events(
    db: Session,
    limit: int = 10,
    exclude_ids: Optional[List[int]] = None,
) -> List[models.Event]:
    """
    Get popular upcoming events, optionally excluding certain event IDs.
    """
    query = (
        db.query(
            models.Event,
            func.count(models.Registration.id).label('registration_count')
        )
        .outerjoin(models.Registration)
        .filter(
            models.Event.start_datetime > datetime.utcnow(),
        )
        .group_by(models.Event.id)
        .order_by(
            func.desc('registration_count'),
            models.Event.start_datetime.asc()
        )
    )
    
    if exclude_ids:
        query = query.filter(~models.Event.id.in_(exclude_ids))
    
    results = query.limit(limit).all()
    return [event for event, _ in results]

def get_similar_events(
    db: Session,
    event_id: int,
    limit: int = 5,
) -> List[models.Event]:
    """
    Get events similar to the specified event.
    """
    # Get the target event
    target_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not target_event:
        return []
    
    # Find similar events (same category, upcoming, not the same event)
    similar_events = (
        db.query(models.Event)
        .filter(
            models.Event.id != target_event.id,
            models.Event.category == target_event.category,
            models.Event.start_datetime > datetime.utcnow(),
        )
        .order_by(
            models.Event.start_datetime.asc()
        )
        .limit(limit)
        .all()
    )
    
    return similar_events