from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache

_DEFAULT_SECRET_KEY = "your-secret-key-here"

class Settings(BaseSettings):
    # API Settings
    APP_NAME: str = "SkillHub Job API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/skillhub"
    REDIS_URL: str = "redis://localhost:6379"
    # Bounded pool: an unbounded Redis client can, under a big enough request
    # burst, open more connections than the Redis server's maxclients allows.
    REDIS_MAX_CONNECTIONS: int = 50
    # Per-process pool. Total Postgres connections = num_processes * (DB_POOL_SIZE + DB_MAX_OVERFLOW).
    # Keep this modest and scale out with more app replicas + a pooler (PgBouncer) in front
    # of Postgres, rather than growing this indefinitely -- see README "Scaling & capacity".
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_RECYCLE: int = 1800  # seconds; recycle connections before they go stale
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skillhub.meritlives.com"
    ]
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = None
    USE_LOCAL_LLM: bool = False
    LOCAL_LLM_URL: str = "http://localhost:11434/api/generate"
    
    # Job Search
    JOBSPY_SITES: List[str] = [
        "linkedin",
        "indeed",
        "glassdoor"
    ]
    JOBSPY_COUNTRY_INDEED: str = "usa"
    SEARCH_TIMEOUT: int = 30
    MAX_SEARCH_RESULTS: int = 50
    # How long a search result set is cached in Redis. Under real load this is
    # the single biggest lever: it stops repeated/popular queries from
    # re-scraping LinkedIn/Indeed/Glassdoor on every request (which is slow
    # and risks the server's IP getting rate-limited or blocked).
    SEARCH_CACHE_TTL_SECONDS: int = 300
    # Caps how many JobSpy scrape calls run at once *within one process*, so a
    # burst of concurrent search requests can't exhaust the thread pool or
    # hammer external job boards all at once. Excess requests queue briefly
    # instead of firing simultaneously.
    MAX_CONCURRENT_SCRAPES: int = 8
    
    # Social Media API Keys
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def normalize_debug(cls, value):
        """Support common deployment labels supplied through environment variables."""
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "production", "prod"}:
                return False
            if normalized in {"development", "dev"}:
                return True
        return value

    @model_validator(mode="after")
    def guard_against_default_secret_in_production(self):
        """Refuse to boot with DEBUG=False while SECRET_KEY is still the
        placeholder value — signing JWTs with a known key is equivalent to
        having no auth at all."""
        if not self.DEBUG and self.SECRET_KEY == _DEFAULT_SECRET_KEY:
            raise ValueError(
                "SECRET_KEY is still the default placeholder. Set a real, "
                "securely generated SECRET_KEY in your environment before "
                "running with DEBUG=False. Generate one with: "
                "python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        return self

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

@lru_cache()
def get_settings():
    """Singleton settings instance"""
    return Settings()

settings = get_settings()
