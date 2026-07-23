from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List
from datetime import datetime
from ..models.job import JobType, ExperienceLevel, JobSource

class JobCreate(BaseModel):
    """Schema for creating a new job"""
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

class JobUpdate(BaseModel):
    """Schema for updating a job"""
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    is_remote: Optional[bool] = None
    expiry_date: Optional[datetime] = None

class JobResponse(BaseModel):
    """Schema for job API response"""
    id: str
    title: str
    company: str
    location: Optional[str]
    description: str
    requirements: Optional[List[str]]
    skills: Optional[List[str]]
    salary_min: Optional[float]
    salary_max: Optional[float]
    job_type: JobType
    experience_level: Optional[ExperienceLevel]
    source: JobSource
    source_url: HttpUrl
    posted_date: Optional[datetime]
    is_remote: bool
    created_at: datetime
    match_score: Optional[float] = None