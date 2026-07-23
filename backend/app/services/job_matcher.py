from typing import List, Dict, Any
import asyncio
from difflib import SequenceMatcher
from ..models.match import JobMatch, SkillMatch
from ..models.job import JobPost
from ..config import settings
from loguru import logger

class JobMatcherService:
    """Service for matching user skills to jobs (string-similarity based)."""

    async def match_skills_to_job(
        self,
        user_skills: List[str],
        job: JobPost
    ) -> Dict[str, Any]:
        """Match user skills to a single job"""

        job_skills = job.skills or []

        skill_matches = []
        matched = []
        missing = []

        for skill in job_skills:
            match_score = self._calculate_skill_match(skill, user_skills)
            skill_match = SkillMatch(
                skill=skill,
                required=True,
                match_score=match_score
            )
            skill_matches.append(skill_match)

            if match_score > 50:
                matched.append(skill)
            else:
                missing.append(skill)

        if job_skills:
            overall_score = sum(s.match_score for s in skill_matches) / len(job_skills)
        else:
            overall_score = 50

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
        """Calculate similarity between a skill and user's skills using simple string matching."""
        if not user_skills:
            return 0.0

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