import re
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import hashlib
import json

def generate_id(prefix: str = "") -> str:
    """Generate unique ID"""
    return f"{prefix}{uuid.uuid4().hex[:8]}"

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from job description text"""
    # Common skill keywords
    common_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Vue", "Angular",
        "Node.js", "Django", "Flask", "FastAPI", "SQL", "PostgreSQL",
        "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Azure",
        "GCP", "Git", "CI/CD", "Agile", "Scrum", "Leadership",
        "Communication", "Problem Solving", "Machine Learning", "AI",
        "Data Analysis", "Cloud Computing", "DevOps", "Security"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills

def extract_years_experience(text: str) -> Optional[int]:
    """Extract years of experience from text"""
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\s*(?:years?|yrs?)\s+experience',
        r'experience:\s*(\d+)\+?'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()

def calculate_match_percentage(skills_matched: int, total_skills: int) -> float:
    """Calculate match percentage"""
    if total_skills == 0:
        return 0.0
    return (skills_matched / total_skills) * 100

def generate_cache_key(*args, **kwargs) -> str:
    """Generate cache key from arguments"""
    key_string = json.dumps(args) + json.dumps(kwargs)
    return hashlib.md5(key_string.encode()).hexdigest()

def parse_salary(salary_string: str) -> Dict[str, Any]:
    """Parse salary string to min/max"""
    # Try to extract numbers
    numbers = re.findall(r'[\d,]+', salary_string)
    if len(numbers) == 2:
        return {
            "min": float(numbers[0].replace(',', '')),
            "max": float(numbers[1].replace(',', ''))
        }
    elif len(numbers) == 1:
        return {
            "min": float(numbers[0].replace(',', '')),
            "max": None
        }
    return {"min": None, "max": None}