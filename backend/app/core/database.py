import uuid
from datetime import datetime
from typing import AsyncGenerator, Optional

from sqlalchemy import Column, String, Boolean, DateTime, select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from ..config import settings

def _to_asyncpg_url(url: str) -> str:
    """Accept a plain postgresql:// URL (what most hosts / docs give you)
    and rewrite it for the async driver, so DATABASE_URL doesn't need a
    special scheme just for this app."""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):  # some hosts (e.g. old Heroku-style) use this
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url

DATABASE_URL = _to_asyncpg_url(settings.DATABASE_URL)

# Pool sizing: with N app processes each holding up to
# (DB_POOL_SIZE + DB_MAX_OVERFLOW) connections, total Postgres connections =
# N * (pool_size + max_overflow). Postgres defaults to max_connections=100,
# so for real concurrency put PgBouncer (transaction pooling mode) in front
# of Postgres rather than raising these numbers indefinitely -- see
# backend/README.md "Scaling & capacity" for the full picture.
engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # detect dead connections instead of erroring on them
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_recycle=settings.DB_POOL_RECYCLE,  # recycle before Postgres/LB idle-kills the conn
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Async DB session dependency -- does not block the event loop or tie
    up a worker thread the way the old sync Session did."""
    async with SessionLocal() as session:
        yield session

async def init_db():
    """Initialize database schema."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    """Dispose the connection pool."""
    await engine.dispose()

class UserAccount(Base):
    """Real user table backing authentication."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[UserAccount]:
    result = await db.execute(select(UserAccount).where(UserAccount.email == email))
    return result.scalar_one_or_none()

async def create_user(
    db: AsyncSession, email: str, name: str, hashed_password: str, role: str = "user"
) -> UserAccount:
    user = UserAccount(email=email, name=name, hashed_password=hashed_password, role=role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# Additional SQLAlchemy models would go here:
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship

class JobModel(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    company_url = Column(String)
    location = Column(String)
    description = Column(String)
    requirements = Column(JSON)
    skills = Column(JSON)
    salary_min = Column(Float)
    salary_max = Column(Float)
    job_type = Column(String)
    experience_level = Column(String)
    source = Column(String)
    source_url = Column(String)
    is_remote = Column(Boolean)
    posted_date = Column(DateTime)
    created_at = Column(DateTime)
"""
