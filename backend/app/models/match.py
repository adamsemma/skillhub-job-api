from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SkillMatch(BaseModel):
    """Individual skill match"""
    skill: str
    required: bool = False
    match_score: float  # 0-100

class JobMatch(BaseModel):
    """Job match result"""
    job_id: str
    job_title: str
    company: str
    location: Optional[str]
    match_score: float  # 0-100
    skill_matches: List[SkillMatch]
    missing_skills: List[str]
    matched_skills: List[str]
    recommendation: str
    source_url: str
    applied: bool = False
    saved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MatchRequest(BaseModel):
    """Match request"""
    user_id: str
    skills: List[str]
    experience_years: Optional[int] = None
    job_titles: Optional[List[str]] = None
    location_preference: Optional[str] = None
    remote_preference: bool = False
    max_matches: int = 10

class MatchResponse(BaseModel):
    """Match response"""
    user_id: str
    total_matches: int
    matches: List[JobMatch]
    response_time: float