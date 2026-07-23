"""Lightweight keyword-based skill extraction.

This is the fast first pass mentioned in the audit: no external API calls,
no model loading, just a curated skill vocabulary matched against job text
with word-boundary-aware regex (so "R" doesn't match inside "Marketing", and
"Go" doesn't match inside "Google"). It's what makes job.skills actually get
populated, which is what the matching engine has needed all along.

If/when higher accuracy is needed, this can be swapped for an LLM call
(OPENAI_API_KEY and langchain are already wired into requirements.txt /
config.py) without changing the call sites in job_search.py or
job_extract.py — both just call extract_skills(text).
"""
import re
from typing import List

# Curated vocabulary of common tech/product skills. Extend as needed —
# this list is intentionally biased toward software/product roles since
# that's what SkillHub serves.
SKILL_VOCABULARY = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart",
    # Web / frontend
    "React", "Vue", "Angular", "Next.js", "Nuxt", "Svelte", "HTML", "CSS",
    "Tailwind CSS", "Redux", "jQuery", "Webpack", "Vite",
    # Backend / frameworks
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot",
    "Ruby on Rails", "Laravel", ".NET", "GraphQL", "REST API", "gRPC",
    # Data / ML
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-learn",
    "Machine Learning", "Deep Learning", "NLP", "Data Analysis",
    "Data Engineering", "ETL", "Spark", "Hadoop", "Airflow",
    # Cloud / infra / devops
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible",
    "CI/CD", "Jenkins", "GitHub Actions", "Linux", "Nginx", "Microservices",
    # Product / soft skills that recur in postings
    "Agile", "Scrum", "Product Management", "Project Management",
    "UI/UX Design", "Figma", "Communication", "Leadership",
    "Problem Solving", "Git", "API Design", "Testing", "QA Automation",
    "Cybersecurity", "Blockchain", "Solidity",
]

# Pre-compile patterns once at import time.
_PATTERNS = [
    (skill, re.compile(r"(?<![\w.+#-])" + re.escape(skill) + r"(?![\w.+#-])", re.IGNORECASE))
    for skill in SKILL_VOCABULARY
]


def extract_skills(text: str, max_skills: int = 25) -> List[str]:
    """Return a de-duplicated list of skills found in `text`, using the
    vocabulary's canonical casing (e.g. always "Python", never "python")."""
    if not text:
        return []

    found: List[str] = []
    for canonical, pattern in _PATTERNS:
        if pattern.search(text):
            found.append(canonical)
            if len(found) >= max_skills:
                break
    return found
