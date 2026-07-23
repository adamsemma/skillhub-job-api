import httpx
from typing import List, Dict, Any, Optional
from loguru import logger
from bs4 import BeautifulSoup
import re
from ..models.job import JobPost, JobSource

class SocialScraperService:
    """Service for scraping job posts from social media"""
    
    def __init__(self):
        self.timeout = 20
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    async def scrape_twitter(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Scrape job posts from Twitter"""
        jobs = []
        try:
            # Twitter search URL (using nitter instance for no API)
            url = f"https://nitter.net/search?q={query}+job"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                tweets = soup.find_all('div', class_='tweet-content')
                
                for tweet in tweets[:max_results]:
                    text = tweet.get_text(strip=True)
                    job = self._extract_job_from_text(text)
                    if job:
                        jobs.append(job)
                        
        except Exception as e:
            logger.error(f"Twitter scraping error: {e}")
            
        return jobs
    
    async def scrape_linkedin_posts(self, query: str) -> List[Dict[str, Any]]:
        """Scrape job posts from LinkedIn (would need API access)"""
        # This would use LinkedIn API or authorized scraping
        # For now, return empty list
        return []
    
    def _extract_job_from_text(self, text: str) -> Optional[Dict[str, Any]]:
        """Extract job details from social media text"""
        # Pattern to find job titles
        job_patterns = [
            r'hiring\s+([^\n]+)',
            r'job\s+opportunity\s+([^\n]+)',
            r'we\'re\s+hiring\s+([^\n]+)',
        ]
        
        for pattern in job_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                return {
                    'title': title,
                    'company': self._extract_company(text),
                    'description': text,
                    'source': 'twitter',
                    'is_remote': 'remote' in text.lower()
                }
        return None
    
    def _extract_company(self, text: str) -> str:
        """Extract company name from text"""
        # Look for @mentions or common company indicators
        company_match = re.search(r'@(\w+)', text)
        if company_match:
            return company_match.group(1)
        return "Unknown Company"