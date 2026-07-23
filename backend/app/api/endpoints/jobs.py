from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ...services.job_extract import JobExtractService
from ...models.job import JobPost
import time

router = APIRouter()
extract_service = JobExtractService()

@router.post("/extract")
async def extract_jobs(urls: List[str]):
    """Extract job details from URLs"""
    if not urls:
        raise HTTPException(status_code=400, detail="URLs list cannot be empty")
    
    start_time = time.time()
    extracted_jobs = []
    
    for url in urls:
        try:
            job_data = await extract_service.extract_job_from_url(url)
            if job_data:
                extracted_jobs.append(job_data)
        except Exception as e:
            # Log error but continue with other URLs
            print(f"Error extracting from {url}: {str(e)}")
    
    return {
        "total_extracted": len(extracted_jobs),
        "jobs": extracted_jobs,
        "response_time": time.time() - start_time
    }

@router.get("/{job_id}")
async def get_job_details(job_id: str):
    """Get details for a specific job"""
    # This would typically fetch from a database
    raise HTTPException(status_code=501, detail="Not implemented yet")