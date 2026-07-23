from fastapi import APIRouter
from . import jobs, match, search

router = APIRouter()

# Include fixed routes before the jobs router, which contains the generic
# `/{job_id}` route. Otherwise paths such as `/search` and `/match` are
# incorrectly treated as job IDs.
router.include_router(search.router, tags=["Search"])
router.include_router(match.router, tags=["Match"])
router.include_router(jobs.router, tags=["Jobs"])

__all__ = ["router"]
