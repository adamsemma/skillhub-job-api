import asyncio
import httpx
from trafilatura import extract
from trafilatura.settings import use_config
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential
from ..models.job import JobPost, JobSource
from ..utils.skill_extractor import extract_skills

class JobExtractService:
    """Service for extracting job details from URLs"""
    
    def __init__(self):
        self.timeout = 20
        
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def extract_job_from_url(self, url: str) -> Optional[Dict[str, Any]]:
        """Extract job details from a URL"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, follow_redirects=True)
                response.raise_for_status()
                
                html_content = response.text
                
                # Extract main content
                text_content = extract(
                    html_content,
                    include_comments=False,
                    include_tables=True,
                    include_formatting=True
                )
                
                if not text_content:
                    # Fallback to BeautifulSoup
                    soup = BeautifulSoup(html_content, 'html.parser')
                    for script in soup(["script", "style"]):
                        script.decompose()
                    text_content = soup.get_text(separator='\n', strip=True)
                
                # Parse job details (would need sophisticated parsing)
                job_data = {
                    "title": self._extract_title(html_content),
                    "company": self._extract_company(html_content),
                    "description": text_content,
                    "requirements": self._extract_requirements(text_content),
                    "skills": self._extract_skills(text_content),
                    "source_url": url,
                }
                
                return job_data
                
        except Exception as e:
            logger.error(f"Extraction error for {url}: {str(e)}")
            return None
    
    def _extract_title(self, html: str) -> str:
        """Extract job title from HTML: prefer og:title, fall back to <title>."""
        soup = BeautifulSoup(html, "html.parser")

        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            return og_title["content"].strip()

        h1 = soup.find("h1")
        if h1 and h1.get_text(strip=True):
            return h1.get_text(strip=True)

        if soup.title and soup.title.get_text(strip=True):
            # Strip common "Title - Company | Site" suffixes.
            return soup.title.get_text(strip=True).split("|")[0].split(" - ")[0].strip()

        return "Untitled job"

    def _extract_company(self, html: str) -> str:
        """Extract company name from HTML: prefer og:site_name / meta author."""
        soup = BeautifulSoup(html, "html.parser")

        og_site = soup.find("meta", property="og:site_name")
        if og_site and og_site.get("content"):
            return og_site["content"].strip()

        author = soup.find("meta", attrs={"name": "author"})
        if author and author.get("content"):
            return author["content"].strip()

        return "Unknown company"

    def _extract_requirements(self, text: str) -> list:
        """Pull out bullet-style lines that look like requirements."""
        if not text:
            return []

        requirement_keywords = ("require", "must have", "you have", "qualification", "you'll need")
        lines = [line.strip("-•*  \t") for line in text.split("\n")]
        requirements = [
            line for line in lines
            if line and any(keyword in line.lower() for keyword in requirement_keywords)
        ]
        return requirements[:15]

    def _extract_skills(self, text: str) -> list:
        """Keyword-based skill extraction (see utils/skill_extractor.py)."""
        return extract_skills(text)
    
    async def extract_multiple(self, urls: list) -> list:
        """Extract jobs from multiple URLs concurrently"""
        tasks = [self.extract_job_from_url(url) for url in urls]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r]