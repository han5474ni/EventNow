from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

import models, schemas
from database import get_db
from security import get_current_active_user, get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats", response_model=dict)
async def get_admin_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    """
    Get admin dashboard statistics.
    Only accessible by admin users.
    """
    try:
        # Get total events count
        total_events = db.query(models.Event).count()
        
        # Get upcoming events count
        upcoming_events = db.query(models.Event).filter(
            models.Event.start_datetime >= datetime.utcnow()
        ).count()
        
        # Get total users count
        total_users = db.query(models.User).count()
        
        # Get total registrations count
        total_registrations = db.query(models.Registration).count()
        
        # Get events by category
        events_by_category = db.query(
            models.Event.category, 
            func.count(models.Event.id).label('count')
        ).group_by(models.Event.category).all()
        
        # Format events by category for response
        categories = []
        for category, count in events_by_category:
            categories.append({
                "name": category,
                "count": count
            })
        
        # Get registrations by status
        registrations_by_status = db.query(
            models.Registration.status, 
            func.count(models.Registration.id).label('count')
        ).group_by(models.Registration.status).all()
        
        # Format registrations by status for response
        registration_stats = []
        for status, count in registrations_by_status:
            registration_stats.append({
                "status": status,
                "count": count
            })
        
        return {
            "totalEvents": total_events,
            "upcomingEvents": upcoming_events,
            "totalUsers": total_users,
            "totalRegistrations": total_registrations,
            "eventsByCategory": categories,
            "registrationsByStatus": registration_stats
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting admin stats: {str(e)}"
        )
