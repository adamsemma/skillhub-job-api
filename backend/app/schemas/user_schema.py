from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str  # user_id
    exp: datetime
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    full_name: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    profile: Optional['UserProfileResponse'] = None

class UserProfileResponse(BaseModel):
    skills: List[str]
    experience_years: int
    job_titles: List[str]
    location: Optional[str]
    remote_preference: bool
    linkedin_url: Optional[str]
    github_url: Optional[str]