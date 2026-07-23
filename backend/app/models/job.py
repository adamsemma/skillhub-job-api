from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class JobSource(str, Enum):
    LINKEDIN = "linkedin"
    INDEED = "indeed"
    GLASSDOOR = "glassdoor"
    REMOTEOK = "remoteok"
    ANGEL = "angel"
    TWITTER = "twitter"
    COMPANY = "company"
    OTHER = "other"

class JobType(str, Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    FREELANCE = "freelance"
    INTERNSHIP = "internship"
    REMOTE = "remote"

class ExperienceLevel(str, Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"

class JobPost(BaseModel):
    """Job posting model"""
    id: Optional[str] = None
    title: str
    company: str
    company_url: Optional[HttpUrl] = None
    location: Optional[str] = None
    description: str
    requirements: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "USD"
    job_type: JobType = JobType.FULL_TIME
    experience_level: Optional[ExperienceLevel] = None
    source: JobSource = JobSource.OTHER
    source_url: HttpUrl
    posted_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    is_remote: bool = False
    benefits: Optional[List[str]] = None
    raw_data: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SearchRequest(BaseModel):
    """Job search request"""
    query: Optional[str] = None
    keywords: Optional[List[str]] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    remote_only: bool = False
    max_results: int = 20
    sources: Optional[List[JobSource]] = None
    days_back: int = 30

class SearchResponse(BaseModel):
    """Job search response"""
    query: str
    total_results: int
    results: List[JobPost]
    response_time: float
    sources: List[JobSource]