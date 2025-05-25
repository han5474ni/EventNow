from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import uuid

from database import Base

class EmailVerification(Base):
    __tablename__ = "email_verifications"

    token = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    email = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="email_verifications")
    
    @classmethod
    def create_token(cls, user_id, email):
        """Create a new email verification token"""
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=48)  # Token valid for 48 hours
        return cls(token=token, user_id=user_id, email=email, expires_at=expires_at)
    
    def is_valid(self):
        """Check if the token is still valid"""
        return datetime.utcnow() < self.expires_at
