from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    PREMIUM = "premium"

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    is_verified: bool = False
    
class UserProfile(BaseModel):
    user_id: str
    skills: List[str] = []
    experience_years: Optional[int] = 0
    job_titles: List[str] = []
    location: Optional[str] = None
    remote_preference: bool = False
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()