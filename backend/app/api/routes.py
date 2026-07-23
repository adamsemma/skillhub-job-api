from fastapi import APIRouter
from .endpoints import router as endpoints_router

# Create main router
router = APIRouter(prefix="/api/v1")

# Include endpoint routers
router.include_router(endpoints_router, prefix="/jobs")

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "SkillHub API"}
