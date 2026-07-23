import httpx
import asyncio
import hashlib
import json
import math
from typing import List, Dict, Any, Tuple
import pandas as pd
from jobspy import scrape_jobs
from loguru import logger
from ..models.job import JobPost, JobSource, SearchRequest
from ..config import settings
from ..utils.skill_extractor import extract_skills
from ..utils.cache import get_cache, set_cache

class JobSearchService:
    """Service for searching jobs from multiple sources"""

    # Shared across all instances/requests in this process: caps how many
    # JobSpy scrapes run at once so a burst of concurrent search requests
    # can't exhaust the default thread pool or hammer LinkedIn/Indeed/
    # Glassdoor all at the same moment (which risks the server's IP getting
    # rate-limited or blocked by those sites).
    _scrape_semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_SCRAPES)

    def __init__(self):
        self.timeout = settings.SEARCH_TIMEOUT
        self.sites = settings.JOBSPY_SITES

    async def search_jobs(self, request: SearchRequest) -> List[JobPost]:
        """Fetch listings from JobSpy without blocking the API event loop."""
        jobs, _ = await self.search_jobs_with_status(request)
        return jobs

    @staticmethod
    def _cache_key(query: str, sites: List[str], request: SearchRequest) -> str:
        payload = json.dumps({
            "q": query.lower().strip(),
            "sites": sorted(sites),
            "location": (request.location or "").lower().strip(),
            "remote_only": request.remote_only,
            "max_results": request.max_results,
            "days_back": request.days_back,
        }, sort_keys=True)
        digest = hashlib.sha256(payload.encode()).hexdigest()
        return f"search:{digest}"

    async def search_jobs_with_status(
        self, request: SearchRequest
    ) -> Tuple[List[JobPost], List[Dict[str, Any]]]:
        """Fetch listings and report how each requested board responded.

        Results are cached in Redis for SEARCH_CACHE_TTL_SECONDS: under real
        traffic, the same handful of popular queries account for a huge
        share of requests, and re-scraping external job boards for every
        single one of them is both slow and the single biggest risk of
        getting the server's IP throttled or banned by those sites.
        """
        query = request.query or " ".join(request.keywords or [])
        if not query:
            return [], []

        requested_sites = [source.value for source in request.sources] if request.sources else self.sites
        sites = [site for site in requested_sites if site in self.sites]
        if not sites:
            return [], []

        cache_key = self._cache_key(query, sites, request)
        cached = await get_cache(cache_key)
        if cached is not None:
            jobs = [JobPost(**job_data) for job_data in cached["jobs"]]
            return jobs, cached["source_status"]

        # Limit how many scrapes run at once in this process; extra callers
        # simply wait their turn instead of all firing simultaneously.
        async with self._scrape_semaphore:
            try:
                dataframe = await asyncio.to_thread(
                    scrape_jobs,
                    site_name=sites,
                    search_term=query,
                    location=request.location,
                    is_remote=request.remote_only,
                    results_wanted=request.max_results,
                    country_indeed=settings.JOBSPY_COUNTRY_INDEED,
                    hours_old=request.days_back * 24,
                    description_format="markdown",
                )
            except Exception as error:
                logger.exception("JobSpy search failed for {!r}", query)
                return [], [
                    {"source": site, "status": "error", "results": 0, "detail": str(error)}
                    for site in sites
                ]

        logger.info("JobSpy returned {} listings for {!r}", len(dataframe), query)
        jobs = self._to_job_posts(dataframe)[:request.max_results]
        counts = {site: 0 for site in sites}
        for job in jobs:
            if job.source.value in counts:
                counts[job.source.value] += 1

        source_status = [
            {
                "source": site,
                "status": "ok" if counts[site] else "no_results",
                "results": counts[site],
            }
            for site in sites
        ]

        await set_cache(
            cache_key,
            {
                "jobs": [job.model_dump(mode="json") for job in jobs],
                "source_status": source_status,
            },
            ttl=settings.SEARCH_CACHE_TTL_SECONDS,
        )

        return jobs, source_status

    @staticmethod
    def _value(value: Any, default: Any = None) -> Any:
        """Convert pandas null values to ordinary Python values."""
        if value is None:
            return default
        if isinstance(value, float) and math.isnan(value):
            return default
        try:
            if pd.isna(value):
                return default
        except (TypeError, ValueError):
            pass
        return value

    @classmethod
    def _clean_text(cls, value: Any, default: str = "") -> str:
        """Repair common UTF-8-as-Latin-1 mojibake from scraped job boards."""
        text = str(cls._value(value, default))
        if any(marker in text for marker in ("â", "Ã", "ð")):
            for encoding in ("cp1252", "latin-1"):
                try:
                    return text.encode(encoding).decode("utf-8")
                except UnicodeError:
                    continue
        return text

    def _to_job_posts(self, dataframe: pd.DataFrame) -> List[JobPost]:
        jobs: List[JobPost] = []
        for row in dataframe.to_dict(orient="records"):
            url = self._value(row.get("job_url"))
            if not url:
                continue

            source_value = str(self._value(row.get("site"), "other")).lower()
            try:
                source = JobSource(source_value)
            except ValueError:
                source = JobSource.OTHER

            date_posted = self._value(row.get("date_posted"))
            if hasattr(date_posted, "to_pydatetime"):
                date_posted = date_posted.to_pydatetime()

            try:
                description = self._clean_text(row.get("description"), "No description provided.")
                jobs.append(JobPost(
                    id=str(self._value(row.get("id"), "")) or None,
                    title=self._clean_text(row.get("title"), "Untitled job"),
                    company=self._clean_text(row.get("company"), "Unknown company"),
                    company_url=self._value(row.get("company_url")),
                    location=self._clean_text(row.get("location")) or None,
                    description=description,
                    skills=extract_skills(description) or None,
                    salary_min=self._value(row.get("min_amount")),
                    salary_max=self._value(row.get("max_amount")),
                    salary_currency=str(self._value(row.get("currency"), "USD")),
                    source=source,
                    source_url=str(url),
                    posted_date=date_posted,
                    is_remote=bool(self._value(row.get("is_remote"), False)),
                ))
            except Exception as error:
                logger.warning("Skipping invalid JobSpy result: {}", error)
        return jobs
