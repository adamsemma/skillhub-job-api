from fastapi import APIRouter, Query, HTTPException, Depends, Request
from typing import List, Optional
from ...services.job_search import JobSearchService
from ...services.job_extract import JobExtractService
from ...models.job import SearchRequest, SearchResponse, JobPost
from ...utils.cache import get_cache, set_cache
from ...middleware.auth import optional_auth
from ...middleware.rate_limit import limiter
import time

router = APIRouter()
search_service = JobSearchService()
extract_service = JobExtractService()

async def _search_response(request: SearchRequest):
    start_time = time.time()
    jobs, source_status = await search_service.search_jobs_with_status(request)
    return {
        "query": request.query or " ".join(request.keywords or []),
        "results": len(jobs),
        "jobs": jobs,
        "source_status": source_status,
        "response_time": time.time() - start_time,
    }

@router.get("/search")
@router.get("/quick", include_in_schema=False)
@limiter.limit("50/minute")
async def quick_search(
    request: Request,
    q: str = Query(..., description="Search query"),
    location: Optional[str] = None,
    remote_only: bool = False,
    max_results: int = Query(10, ge=1, le=50)
):
    """Quick search endpoint for simple queries"""
    search_request = SearchRequest(
        query=q,
        location=location,
        remote_only=remote_only,
        max_results=max_results
    )
    return await _search_response(search_request)

@router.post("/search")
@limiter.limit("50/minute")
async def search_jobs(request: Request, body: SearchRequest, user: Optional[dict] = Depends(optional_auth)):
    """Search job boards using a JSON request body.

    Stays open to anonymous callers; `user` is populated when a valid
    bearer token is present, for future use (e.g. saved searches).
    """
    if not body.query and not body.keywords:
        raise HTTPException(status_code=400, detail="query or keywords is required")
    return await _search_response(body)

@router.get("/suggestions")
@limiter.limit("100/minute")
async def get_suggestions(
    request: Request,
    q: str = Query(..., description="Search term for suggestions")
):
    """Get job title suggestions"""
    # Common job titles for autocomplete
    suggestions = [
        "Software Engineer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
        "DevOps Engineer",
        "Full Stack Developer",
        "Machine Learning Engineer",
        "Cloud Architect",
        "Frontend Developer",
        "Backend Developer"
    ]

    # Filter suggestions based on query
    filtered = [s for s in suggestions if q.lower() in s.lower()]

    return {"suggestions": filtered[:10]}
