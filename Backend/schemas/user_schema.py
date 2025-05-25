from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserRole(str, Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    GENERAL = "general"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    profile_image: Optional[str] = None

class UserInDB(UserBase):
    id: int
    is_active: bool = True
    role: UserRole = UserRole.GENERAL
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserResponse(UserInDB):
    pass

class UserWithEvents(UserResponse):
    organized_events: List[dict] = []
    registered_events: List[dict] = []