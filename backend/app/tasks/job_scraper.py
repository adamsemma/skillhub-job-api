from celery import Celery
from loguru import logger
from ..services.job_search import JobSearchService
from ..services.job_extract import JobExtractService
from ..models.job import SearchRequest
import asyncio

celery_app = Celery('tasks')

@celery_app.task
def run_job_scraper():
    """Background task to scrape jobs from all sources"""
    logger.info("Starting job scraper task...")
    
    # Run async task
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(_scrape_jobs())
    loop.close()
    
    return result

async def _scrape_jobs():
    """Async job scraping logic"""
    search_service = JobSearchService()
    
    # Search for common job queries
    queries = [
        "Software Engineer",
        "Data Scientist",
        "Python Developer",
        "React Developer",
        "DevOps Engineer"
    ]
    
    all_jobs = []
    for query in queries:
        request = SearchRequest(
            query=query,
            max_results=20
        )
        jobs = await search_service.search_jobs(request)
        all_jobs.extend(jobs)
        logger.info(f"Found {len(jobs)} jobs for '{query}'")
    
    # Save to database (would be implemented)
    logger.info(f"Total jobs scraped: {len(all_jobs)}")
    
    return {
        "status": "completed",
        "jobs_found": len(all_jobs),
        "queries": queries
    }

@celery_app.task
def schedule_daily_scrape():
    """Scheduled job to run daily"""
    logger.info("Running daily job scrape schedule")
    run_job_scraper.delay()
    return {"status": "scheduled"}