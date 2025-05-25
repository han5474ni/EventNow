from datetime import datetime
import os
import shutil
import logging
from typing import List, Optional, Dict, Any

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks, UploadFile, File, Form
from sqlalchemy.orm import Session

import models, schemas
from database import get_db
from security import get_current_active_user, get_current_admin
from services.notification_service import send_event_notification_email

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("/", response_model=List[schemas.Event])
def list_events(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    upcoming_only: bool = True,
    db: Session = Depends(get_db),
):
    """List all events with optional filtering."""
    try:
        logger.debug("Starting list_events function")
        logger.debug(f"Parameters: skip={skip}, limit={limit}, category={category}, upcoming_only={upcoming_only}")
        
        query = db.query(models.Event)
        logger.debug("Created base query")
        
        if category:
            logger.debug(f"Filtering by category: {category}")
            # Gunakan filter case-insensitive untuk kategori
            query = query.filter(models.Event.category.ilike(f"%{category}%"))
        
        if upcoming_only:
            logger.debug("Filtering by upcoming events")
            query = query.filter(models.Event.start_datetime >= datetime.utcnow())
        
        logger.debug("Ordering by start_datetime")
        query = query.order_by(models.Event.start_datetime.asc())
        
        logger.debug(f"Applying offset {skip} and limit {limit}")
        result = query.offset(skip).limit(limit).all()
        logger.debug(f"Found {len(result)} events")
        
        return result
    except Exception as e:
        logger.error(f"Error in list_events: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=schemas.Event, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: schemas.EventCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """
    Create a new event using JSON data. Only admins can create events.
    
    This endpoint accepts JSON data with the following fields:
    - title: Event title (required)
    - description: Event description (required)
    - category: Event category (required, one of: conference, workshop, seminar, meetup, hackathon, other)
    - location: Event location (required)
    - start_datetime: Event start date and time in ISO format (required)
    - end_datetime: Event end date and time in ISO format (required)
    - max_participants: Maximum number of participants (optional)
    - registration_deadline: Registration deadline in ISO format (optional)
    - registration_link: External registration link (optional)
    - image_url: URL to event image (optional)
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create events",
        )
    
    # Log the event data for debugging
    logger.debug(f"Creating event with data: {event.dict()}")
    logger.debug(f"Registration link: {event.registration_link}")
    logger.debug(f"Max participants: {event.max_participants}")
    logger.debug(f"Registration deadline: {event.registration_deadline}")
    
    # Create event object
    event_data = event.dict()
    db_event = models.Event(
        **event_data,
        organizer_id=current_user.id,
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Log the created event for verification
    logger.debug(f"Created event: {db_event.id}, registration_link: {db_event.registration_link}, "
                f"max_participants: {db_event.max_participants}, "
                f"registration_deadline: {db_event.registration_deadline}")
    
    # Get all active users to notify them about the new event
    active_users = db.query(models.User).filter(models.User.is_active == True).all()
    recipient_emails = [user.email for user in active_users]
    
    # Send email notifications
    try:
        await send_event_notification_email(background_tasks, db_event, recipient_emails)
        print(f"Event notification emails queued for {len(recipient_emails)} recipients")
    except Exception as e:
        # Log the error but don't fail the request
        print(f"Error sending event notification emails: {e}")
    
    return db_event

@router.post("/form", response_model=schemas.Event, status_code=status.HTTP_201_CREATED)
async def create_event_form(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    start_datetime: str = Form(...),
    end_datetime: str = Form(...),
    max_participants: int = Form(None),
    registration_deadline: str = Form(None),
    registration_link: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """
    Create a new event using form data with file upload. Only admins can create events.
    
    This endpoint accepts form data with the following fields:
    - title: Event title (required)
    - description: Event description (required)
    - category: Event category (required, one of: conference, workshop, seminar, meetup, hackathon, other)
    - location: Event location (required)
    - start_datetime: Event start date and time in ISO format (required)
    - end_datetime: Event end date and time in ISO format (required)
    - max_participants: Maximum number of participants (optional)
    - registration_deadline: Registration deadline in ISO format (optional)
    - registration_link: External registration link (optional)
    - image: Event image file (optional)
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create events",
        )
    
    # Log received form data for debugging
    logger.debug(f"Received form data for event creation:")
    logger.debug(f"title: {title}")
    logger.debug(f"description: {description}")
    logger.debug(f"category: {category}")
    logger.debug(f"location: {location}")
    logger.debug(f"start_datetime: {start_datetime}")
    logger.debug(f"end_datetime: {end_datetime}")
    logger.debug(f"max_participants: {max_participants}")
    logger.debug(f"registration_deadline: {registration_deadline}")
    logger.debug(f"registration_link: {registration_link}")
    logger.debug(f"image: {image.filename if image else None}")
    
    # Parse datetime strings
    try:
        # Handle different datetime formats
        start_dt = datetime.fromisoformat(start_datetime.replace('Z', '+00:00') if start_datetime.endswith('Z') else start_datetime)
        end_dt = datetime.fromisoformat(end_datetime.replace('Z', '+00:00') if end_datetime.endswith('Z') else end_datetime)
        
        # Handle registration_deadline which might be None or empty string
        reg_deadline = None
        if registration_deadline and registration_deadline.strip():
            reg_deadline = datetime.fromisoformat(registration_deadline.replace('Z', '+00:00') if registration_deadline.endswith('Z') else registration_deadline)
            logger.debug(f"Parsed registration_deadline: {reg_deadline}")
    except ValueError as e:
        logger.error(f"Error parsing datetime: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid datetime format: {str(e)}. Use ISO format (YYYY-MM-DDTHH:MM:SS)",
        )
    
    # Create event data dictionary
    event_data = {
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "start_datetime": start_dt,
        "end_datetime": end_dt,
        "max_participants": max_participants,
        "registration_deadline": reg_deadline,
        "registration_link": registration_link,
        "organizer_id": current_user.id,
    }
    
    logger.debug(f"Event data prepared for database: {event_data}")
    
    # Handle image upload if provided
    if image and image.filename:
        # Create directory if it doesn't exist
        os.makedirs("static/event_images", exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(image.filename)[1]
        image_name = f"event_{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
        image_path = f"static/event_images/{image_name}"
        
        # Save the file
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Add image URL to event data
        event_data["image_url"] = f"/static/event_images/{image_name}"
    
    # Create and save the event
    db_event = models.Event(**event_data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Get all active users to notify them about the new event
    active_users = db.query(models.User).filter(models.User.is_active == True).all()
    recipient_emails = [user.email for user in active_users]
    
    # Send email notifications
    try:
        await send_event_notification_email(background_tasks, db_event, recipient_emails)
        print(f"Event notification emails queued for {len(recipient_emails)} recipients")
    except Exception as e:
        # Log the error but don't fail the request
        print(f"Error sending event notification emails: {e}")
    
    return db_event

@router.get("/{event_id}", response_model=schemas.EventDetail)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event by ID."""
    try:
        # Log untuk debugging
        logger.debug(f"Getting event with ID: {event_id}")
        
        # Ambil event dari database
        event = db.query(models.Event).filter(models.Event.id == event_id).first()
        if not event:
            logger.debug(f"Event with ID {event_id} not found")
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Log event data for debugging
        logger.debug(f"Event found: {event.title}")
        logger.debug(f"Event registration_link: {event.registration_link}")
        logger.debug(f"Event max_participants: {event.max_participants}")
        logger.debug(f"Event registration_deadline: {event.registration_deadline}")
        
        # Hitung jumlah komentar dan registrasi
        comments_count = len(event.comments)
        registrations_count = len(event.registrations)
        
        # Karena tidak ada current_user, selalu set is_registered ke False
        is_registered = False
        
        # Buat dictionary dari event dan tambahkan field tambahan
        event_dict = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "category": event.category,
            "location": event.location,
            "start_datetime": event.start_datetime,
            "end_datetime": event.end_datetime,
            "max_attendees": event.max_participants,  # Sesuaikan dengan nama field di model
            "is_public": True,  # Default ke True jika tidak ada di model
            "image_url": event.image_url,
            "organizer_id": event.organizer_id,
            "created_at": event.created_at,
            "updated_at": event.updated_at,
            "is_cancelled": event.status == "cancelled",  # Sesuaikan dengan logika status
            "comments_count": comments_count,
            "registrations_count": registrations_count,
            "is_registered": is_registered
        }
        
        logger.debug(f"Successfully retrieved event: {event.title}")
        return event_dict
    except Exception as e:
        logger.error(f"Error in get_event: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Update an event. Only admins or the event organizer can update."""
    # Log the update data for debugging
    logger.debug(f"Updating event {event_id} with data: {event_update.dict()}")
    
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not current_user.is_admin and db_event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this event",
        )
    
    # Get the update data, ensuring we don't exclude any fields
    update_data = event_update.dict(exclude_unset=False)
    logger.debug(f"Update data after dict conversion: {update_data}")
    
    # Explicitly handle special fields
    if 'registration_deadline' in update_data:
        logger.debug(f"Setting registration_deadline to {update_data['registration_deadline']}")
    if 'registration_link' in update_data:
        logger.debug(f"Setting registration_link to {update_data['registration_link']}")
    if 'max_participants' in update_data:
        logger.debug(f"Setting max_participants to {update_data['max_participants']}")
    
    # Update all fields
    for field, value in update_data.items():
        logger.debug(f"Setting {field} to {value}")
        # Skip field is_public karena kolom belum tersedia di database
        if field == 'is_public':
            logger.debug(f"Skipping field is_public because the column is not available in the database")
            continue
        setattr(db_event, field, value)
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Log the updated event for verification
    logger.debug(f"Updated event: {db_event.id}, registration_link: {db_event.registration_link}, "
                f"max_participants: {db_event.max_participants}, "
                f"registration_deadline: {db_event.registration_deadline}")
    
    return db_event

@router.put("/{event_id}/image", response_model=schemas.Event)
def update_event_image(
    event_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """
    Update event image. Only admins or the event organizer can update.
    
    This endpoint accepts a multipart/form-data request with an image file.
    The image will be stored on the server and the event's image_url will be updated.
    Any previous image associated with this event will be deleted.
    """
    # Check if event exists
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check permissions
    if not current_user.is_admin and db_event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this event",
        )
    
    # Delete old image if exists
    if db_event.image_url:
        old_image_path = os.path.join(".", db_event.image_url.lstrip("/"))
        if os.path.exists(old_image_path):
            try:
                os.remove(old_image_path)
            except Exception as e:
                print(f"Error removing old image: {e}")
    
    # Create directory if it doesn't exist
    os.makedirs("static/event_images", exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(image.filename)[1]
    image_name = f"event_{event_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
    image_path = f"static/event_images/{image_name}"
    
    # Save the file
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    # Update image URL in database
    db_event.image_url = f"/static/event_images/{image_name}"
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    return db_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Delete an event. Only admins or the event organizer can delete."""
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not current_user.is_admin and db_event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this event",
        )
    
    db.delete(db_event)
    db.commit()
    return None

@router.get("/{event_id}/registrations", response_model=List[schemas.Registration])
def get_event_registrations(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Get all registrations for an event. Only accessible by admin or event organizer."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not current_user.is_admin and event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view registrations for this event",
        )
    
    return event.registrations
