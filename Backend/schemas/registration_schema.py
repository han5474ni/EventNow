from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum

class RegistrationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    ATTENDED = "attended"

class RegistrationBase(BaseModel):
    status: Optional[RegistrationStatus] = RegistrationStatus.PENDING
    attended: Optional[bool] = False

class RegistrationCreate(RegistrationBase):
    event_id: int

class RegistrationUpdate(RegistrationBase):
    pass

class Registration(RegistrationBase):
    id: int
    user_id: int
    event_id: int
    registration_date: datetime
    
    class Config:
        orm_mode = True

class RegistrationWithEvent(Registration):
    event: dict
    
class RegistrationWithUser(Registration):
    user: dict