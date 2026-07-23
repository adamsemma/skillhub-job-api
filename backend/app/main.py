from fastapi import FastAPI, HTTPException, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from loguru import logger
import asyncio
import uvicorn

from .config import settings
from .api.routes import router
from .utils.cache import init_redis, close_redis
from .core.database import init_db, close_db, get_db, get_user_by_email, create_user
from .core.security import hash_password, verify_password, create_access_token
from .middleware.rate_limit import limiter
from .models.job import SearchRequest
from .services.job_search import JobSearchService
from prometheus_fastapi_instrumentator import Instrumentator

search_service = JobSearchService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup/shutdown"""
    logger.info("🚀 Starting SkillHub Job API...")
    
    # Initialize services
    await init_redis()
    await init_db()
    
    logger.info("✅ All services initialized")
    yield
    
    # Cleanup
    logger.info("🔄 Shutting down...")
    await close_redis()
    await close_db()
    logger.info("✅ Shutdown complete")

# Create app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered job search and matching API for SkillHub",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure in production
)

# Rate limiting (protects the app itself, and the external job boards
# JobSpy scrapes, from being overwhelmed by request bursts)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Include routes
app.include_router(router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "redis": "connected",
            "search": "ready"
        }
    }

@app.post("/api/search")
@limiter.limit("50/minute")
async def compat_search(request: Request, payload: dict):
    """Compatibility endpoint used by the frontend search experience."""
    query = (payload.get("query") or payload.get("q") or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    max_results = int(payload.get("max_results", 5) or 5)
    include_answer = bool(payload.get("include_answer", True))

    search_request = SearchRequest(query=query, max_results=max_results)
    try:
        jobs = await search_service.search_jobs(search_request)
    except Exception:
        jobs = []

    results = []
    for job in jobs[:max_results]:
        results.append({
            "title": getattr(job, "title", "Untitled job"),
            "url": str(getattr(job, "source_url", "")),
            "content": (getattr(job, "description", "") or "")[:500],
            "score": 1.0,
        })

    return {
        "query": query,
        "answer": query if include_answer else None,
        "results": results,
        "response_time": 0.0,
        "mock": False,
    }

@app.get("/api/dashboard/jobs")
@limiter.limit("50/minute")
async def dashboard_jobs(
    request: Request,
    query: str = Query(default="", description="Search query"),
    max_results: int = Query(default=5, ge=1, le=20),
):
    """Compatibility endpoint used by the dashboard jobs experience."""
    search_query = (query or "").strip()
    if not search_query:
        raise HTTPException(status_code=400, detail="Query is required")

    search_request = SearchRequest(query=search_query, max_results=max_results)
    try:
        jobs = await search_service.search_jobs(search_request)
    except Exception:
        jobs = []

    results = []
    for job in jobs[:max_results]:
        results.append({
            "title": getattr(job, "title", "Untitled job"),
            "url": str(getattr(job, "source_url", "")),
            "content": (getattr(job, "description", "") or "")[:500],
            "score": 1.0,
        })

    return {
        "query": search_query,
        "results": results,
        "jobs": [
            job.model_dump(mode="json") if hasattr(job, "model_dump") else job.dict()
            for job in jobs[:max_results]
        ],
        "response_time": 0.0,
        "mock": False,
    }

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, payload: dict, db: AsyncSession = Depends(get_db)):
    """Real, DB-backed login.

    There is no separate registration screen in the frontend yet, so the
    first successful login for a given email creates the account (with a
    securely hashed password); every login after that verifies against the
    stored hash. This keeps the existing single-page login UX while removing
    the old behavior where literally any well-formed email/password pair
    was accepted.
    """
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    if "@" not in email or "." not in email.split("@", 1)[1]:
        raise HTTPException(status_code=400, detail="Enter a valid email address")

    user = await get_user_by_email(db, email)

    if user is None:
        # First time we've seen this email: create the account.
        # bcrypt hashing is deliberately CPU-slow -- run it off the event
        # loop so one signup doesn't stall every other request being served
        # by this process at the same time.
        name = email.split("@", 1)[0].replace(".", " ").title()
        hashed = await asyncio.to_thread(hash_password, password)
        user = await create_user(db, email=email, name=name, hashed_password=hashed)
    else:
        password_ok = await asyncio.to_thread(verify_password, password, user.hashed_password)
        if not password_ok:
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.DEBUG
    )
