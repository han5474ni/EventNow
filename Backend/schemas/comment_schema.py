from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CommentBase(BaseModel):
    content: str = Field(..., min_length=1)
    rating: Optional[int] = Field(None, ge=1, le=5)  # 1-5 star rating, optional

class CommentCreate(CommentBase):
    event_id: int

class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1)
    rating: Optional[int] = Field(None, ge=1, le=5)

class Comment(CommentBase):
    id: int
    author_id: int
    event_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class CommentWithAuthor(Comment):
    author: dict

class CommentWithEvent(Comment):
    event: dict