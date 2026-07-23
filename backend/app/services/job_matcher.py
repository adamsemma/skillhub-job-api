from typing import List, Dict, Any
import asyncio
from difflib import SequenceMatcher
from ..models.match import JobMatch, SkillMatch
from ..models.job import JobPost
from ..config import settings
from loguru import logger

# Try to import optional dependencies
try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    logger.warning("sentence-transformers not available, using simple string matching")

try:
    from langchain.llms import OpenAI
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False
    logger.warning("langchain not available")

class JobMatcherService:
    """Service for matching user skills to jobs"""
    
    def __init__(self):
        # Load embedding model if available
        self.model = None
        if HAS_TRANSFORMERS:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                logger.warning(f"Failed to load SentenceTransformer: {e}")
        
        # Initialize LLM if available
        self.llm = None
        if HAS_LANGCHAIN and settings.OPENAI_API_KEY:
            try:
                self.llm = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI: {e}")
    
    async def match_skills_to_job(
        self, 
        user_skills: List[str], 
        job: JobPost
    ) -> Dict[str, Any]:
        """Match user skills to a single job"""
        
        # Extract skills from job description
        job_skills = job.skills or []
        
        # Calculate match scores
        skill_matches = []
        matched = []
        missing = []
        
        for skill in job_skills:
            # Check if skill is in user's skills (fuzzy match)
            match_score = self._calculate_skill_match(skill, user_skills)
            skill_match = SkillMatch(
                skill=skill,
                required=True,  # Would determine based on job
                match_score=match_score
            )
            skill_matches.append(skill_match)
            
            if match_score > 50:
                matched.append(skill)
            else:
                missing.append(skill)
        
        # Calculate overall match score
        if job_skills:
            overall_score = sum(s.match_score for s in skill_matches) / len(job_skills)
        else:
            overall_score = 50
        
        # Generate recommendation
        recommendation = self._generate_recommendation(
            matched, missing, overall_score
        )
        
        return {
            "match_score": overall_score,
            "skill_matches": skill_matches,
            "matched_skills": matched,
            "missing_skills": missing,
            "recommendation": recommendation
        }
    
    def _calculate_skill_match(self, skill: str, user_skills: List[str]) -> float:
        """Calculate similarity between a skill and user's skills"""
        if not user_skills:
            return 0.0
        
        # Use embeddings if available
        if self.model and HAS_TRANSFORMERS:
            try:
                skill_embedding = self.model.encode([skill])
                user_embeddings = self.model.encode(user_skills)
                
                # Calculate similarity
                similarities = cosine_similarity(skill_embedding, user_embeddings)[0]
                max_similarity = max(similarities) if len(similarities) > 0 else 0
                
                # Convert to percentage
                return float(max_similarity * 100)
            except Exception as e:
                logger.warning(f"Error in embedding-based matching: {e}")
        
        # Fallback: simple string matching
        max_similarity = 0.0
        for user_skill in user_skills:
            similarity = SequenceMatcher(None, skill.lower(), user_skill.lower()).ratio()
            max_similarity = max(max_similarity, similarity)
        
        return float(max_similarity * 100)
    
    def _generate_recommendation(
        self, 
        matched: List[str], 
        missing: List[str],
        score: float
    ) -> str:
        """Generate recommendation"""
        if score > 70:
            return f"Strong match! You have {len(matched)} matching skills. Consider applying."
        elif score > 50:
            missing_str = ', '.join(missing[:3]) if missing else 'some skills'
            return f"Good potential. Focus on learning: {missing_str}."
        else:
            missing_str = ', '.join(missing[:5]) if missing else 'required skills'
            return f"Consider developing these skills first: {missing_str}."
    
    async def match_multiple_jobs(
        self, 
        user_skills: List[str], 
        jobs: List[JobPost],
        max_matches: int = 10
    ) -> List[Dict[str, Any]]:
        """Match user skills to multiple jobs"""
        tasks = []
        for job in jobs:
            tasks.append(self.match_skills_to_job(user_skills, job))
        
        results = await asyncio.gather(*tasks)
        
        # Sort by match score
        sorted_results = sorted(
            zip(jobs, results),
            key=lambda x: x[1]['match_score'],
            reverse=True
        )
        
        return [
            {
                "job": job,
                "match": match_result
            }
            for job, match_result in sorted_results[:max_matches]
        ]