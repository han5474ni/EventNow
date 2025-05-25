from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from .base import Base
import enum

class RegistrationStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    ATTENDED = "attended"

class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status = Column(Enum(RegistrationStatus), default=RegistrationStatus.PENDING)
    registration_date = Column(DateTime, default=datetime.utcnow)
    attended = Column(Boolean, default=False)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    
    def __repr__(self):
        return f"<Registration {self.user.email} for {self.event.title}>"