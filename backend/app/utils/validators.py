import re
from typing import Optional, Dict
from email_validator import validate_email, EmailNotValidError

def validate_email_address(email: str) -> bool:
    """Validate email address"""
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

def validate_password(password: str) -> Dict[str, bool]:
    """Validate password strength"""
    is_valid = True
    errors = []
    
    if len(password) < 8:
        is_valid = False
        errors.append("Password must be at least 8 characters")
    
    if not re.search(r'[A-Z]', password):
        is_valid = False
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        is_valid = False
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        is_valid = False
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        is_valid = False
        errors.append("Password must contain at least one special character")
    
    return {
        "is_valid": is_valid,
        "errors": errors
    }

def validate_url(url: str) -> bool:
    """Validate URL format"""
    url_pattern = re.compile(
        r'^(https?://)?'  # http:// or https://
        r'([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}'  # domain
        r'(:\d+)?'  # optional port
        r'(/.*)?$'  # optional path
    )
    return bool(url_pattern.match(url))

def validate_skill_list(skills: list) -> bool:
    """Validate skill list"""
    if not skills:
        return False
    return all(isinstance(skill, str) and len(skill) > 0 for skill in skills)

def sanitize_input(text: str) -> str:
    """Sanitize input text"""
    # Remove dangerous characters
    sanitized = re.sub(r'[<>{}]', '', text)
    return sanitized.strip()