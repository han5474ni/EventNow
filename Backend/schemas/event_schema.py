from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class EventCategory(str, Enum):
    ACADEMIC = "academic"
    CULTURE = "culture"
    SPORTS = "sports"
    SEMINAR = "seminar"
    WORKSHOP = "workshop"
    COMPETITION = "competition"
    OTHER = "other"
    
    @classmethod
    def _missing_(cls, value):
        # Handle case-insensitive matching
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None

class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)  # Menggunakan string alih-alih enum
    location: str = Field(..., min_length=1, max_length=200)
    start_datetime: datetime
    end_datetime: datetime
    max_participants: Optional[int] = Field(None, gt=0)  # Konsisten menggunakan max_participants
    registration_deadline: Optional[datetime] = None
    registration_link: Optional[str] = None
    # Sementara komentar is_public karena kolom belum tersedia di database
    # is_public: bool = True
    image_url: Optional[str] = None

class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)  # Menggunakan string alih-alih enum
    location: str = Field(..., min_length=1, max_length=200)
    start_datetime: datetime
    end_datetime: datetime
    max_participants: Optional[int] = Field(None, gt=0)
    registration_deadline: Optional[datetime] = None
    registration_link: Optional[str] = None
    image_url: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=50)  # Menggunakan string alih-alih enum
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    max_participants: Optional[int] = Field(None, gt=0)  # Konsisten menggunakan max_participants
    registration_deadline: Optional[datetime] = None
    registration_link: Optional[str] = None
    # Sementara komentar is_public karena kolom belum tersedia di database
    # is_public: bool = True  # Default ke True untuk menghindari nilai None

class Event(EventBase):
    id: int
    organizer_id: int
    created_at: datetime
    updated_at: datetime
    is_cancelled: bool = False
    
    class Config:
        orm_mode = True

class EventWithOrganizer(Event):
    organizer: dict

class EventDetail(Event):
    """Detailed event information including comments and registrations count"""
    comments_count: int = 0
    registrations_count: int = 0
    is_registered: bool = False
    registration_link: Optional[str] = None
    registration_deadline: Optional[datetime] = None
    max_participants: Optional[int] = None
    # Sementara komentar is_public karena kolom belum tersedia di database
    # is_public: bool = True