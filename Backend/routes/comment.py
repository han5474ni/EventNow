from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models, schemas
from database import get_db
from security import get_current_active_user

router = APIRouter(prefix="/api/comments", tags=["Comments"])

@router.post("/", response_model=schemas.Comment, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Create a new comment on an event."""
    # Check if event exists
    event = db.query(models.Event).filter(models.Event.id == comment.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Komentar diperbolehkan untuk semua event, baik yang sudah selesai maupun belum
    
    # Check if user has already commented on this event
    existing_comment = (
        db.query(models.Comment)
        .filter(
            models.Comment.author_id == current_user.id,
            models.Comment.event_id == comment.event_id,
        )
        .first()
    )
    
    if existing_comment:
        raise HTTPException(
            status_code=400,
            detail="You have already commented on this event",
        )
    
    # Create new comment
    db_comment = models.Comment(
        **comment.dict(),
        author_id=current_user.id,
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/event/{event_id}", response_model=List[schemas.CommentWithAuthor])
def get_event_comments(
    event_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all comments for an event."""
    # Check if event exists
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return (
        db.query(models.Comment)
        .filter(models.Comment.event_id == event_id)
        .order_by(models.Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.put("/{comment_id}", response_model=schemas.Comment)
def update_comment(
    comment_id: int,
    comment_update: schemas.CommentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Update a comment. Only the comment author can update their comment."""
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment",
        )
    
    # Update only the fields that were provided
    for field, value in comment_update.dict(exclude_unset=True).items():
        setattr(db_comment, field, value)
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Delete a comment. Only the comment author or an admin can delete."""
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment",
        )
    
    db.delete(db_comment)
    db.commit()
    return None
