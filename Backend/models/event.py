from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from .base import Base
import enum

class EventCategory(enum.Enum):
    ACADEMIC = "academic"
    CULTURE = "culture"
    SPORTS = "sports"
    SEMINAR = "seminar"
    WORKSHOP = "workshop"
    COMPETITION = "competition"
    OTHER = "other"

class EventStatus(enum.Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # Menggunakan String alih-alih Enum
    location = Column(String(200), nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    registration_deadline = Column(DateTime, nullable=True)
    max_participants = Column(Integer, nullable=True)
    registration_link = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default='upcoming')  # Menggunakan String alih-alih Enum
    is_featured = Column(Boolean, default=False)
    # Sementara komentar is_public karena kolom belum tersedia di database
    # is_public = Column(Boolean, default=True)  # Menambahkan field is_public dengan default True
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    organizer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    organizer = relationship("User", back_populates="events_created")
    comments = relationship("Comment", back_populates="event", cascade="all, delete-orphan")
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Event {self.title}>"
    
    @property
    def is_registration_open(self):
        if not self.registration_deadline:
            return True
        return datetime.utcnow() < self.registration_deadline
    
    @property
    def available_slots(self):
        if not self.max_participants:
            return float('inf')
        return max(0, self.max_participants - len(self.registrations))