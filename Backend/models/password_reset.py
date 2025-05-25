from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import uuid

from database import Base

class PasswordReset(Base):
    __tablename__ = "password_resets"

    token = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="password_resets")
    
    @classmethod
    def create_token(cls, user_id):
        """Create a new password reset token"""
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=24)  # Token valid for 24 hours
        return cls(token=token, user_id=user_id, expires_at=expires_at)
    
    def is_valid(self):
        """Check if the token is still valid"""
        return datetime.utcnow() < self.expires_at
