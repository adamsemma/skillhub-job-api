from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from ...models.match import MatchRequest, MatchResponse, JobMatch
from ...services.job_matcher import JobMatcherService
from ...services.job_search import JobSearchService
from ...services.job_extract import JobExtractService
from ...models.job import SearchRequest
from ...middleware.auth import authenticate_request
from ...middleware.rate_limit import limiter
import time

router = APIRouter()
matcher_service = JobMatcherService()
search_service = JobSearchService()
extract_service = JobExtractService()

@router.post("/match", response_model=MatchResponse)
@limiter.limit("20/minute")
async def match_jobs(request: Request, body: MatchRequest, user: dict = Depends(authenticate_request)):
    """Match user skills to jobs"""
    if user.get("sub") != body.user_id and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Cannot request matches for another user")

    start_time = time.time()

    # Search for relevant jobs
    search_request = SearchRequest(
        query=" ".join(body.job_titles or ["jobs"]),
        location=body.location_preference,
        remote_only=body.remote_preference,
        max_results=body.max_matches * 2  # Search more to ensure enough matches
    )

    jobs = await search_service.search_jobs(search_request)

    if not jobs:
        return MatchResponse(
            user_id=body.user_id,
            total_matches=0,
            matches=[],
            response_time=time.time() - start_time
        )

    # Match jobs
    matches = await matcher_service.match_multiple_jobs(
        body.skills,
        jobs,
        body.max_matches
    )

    # Convert to response format
    job_matches = []
    for match_result in matches:
        job = match_result["job"]
        match = match_result["match"]

        job_match = JobMatch(
            job_id=job.id or str(hash(job.source_url)),
            job_title=job.title,
            company=job.company,
            location=job.location,
            match_score=match["match_score"],
            skill_matches=match["skill_matches"],
            missing_skills=match["missing_skills"],
            matched_skills=match["matched_skills"],
            recommendation=match["recommendation"],
            source_url=str(job.source_url)
        )
        job_matches.append(job_match)

    return MatchResponse(
        user_id=body.user_id,
        total_matches=len(job_matches),
        matches=job_matches,
        response_time=time.time() - start_time
    )

@router.post("/match/single")
@limiter.limit("20/minute")
async def match_single_job(
    request: Request,
    user_skills: List[str],
    job_url: str,
    user: dict = Depends(authenticate_request)
):
    """Match user skills to a single job URL"""
    # Extract job from URL
    job_data = await extract_service.extract_job_from_url(job_url)

    if not job_data:
        raise HTTPException(status_code=404, detail="Could not extract job")

    # Create job object
    from ...models.job import JobPost
    job = JobPost(**job_data)

    # Match
    match_result = await matcher_service.match_skills_to_job(user_skills, job)

    return {
        "job": job,
        "match": match_result
    }
