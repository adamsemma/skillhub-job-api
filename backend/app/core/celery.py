from celery import Celery
from ..config import settings

# Create Celery app
celery_app = Celery(
    "skillhub",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.job_scraper", "app.tasks.email_notifier"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    result_expires=3600,  # 1 hour
)

# Scheduled tasks
celery_app.conf.beat_schedule = {
    "run-job-scraper-every-6-hours": {
        "task": "app.tasks.job_scraper.run_job_scraper",
        "schedule": 21600,  # 6 hours
    },
    "send-daily-digest-at-9am": {
        "task": "app.tasks.email_notifier.send_daily_digest",
        "schedule": "0 9 * * *",  # 9 AM daily
    },
}

if __name__ == "__main__":
    celery_app.start()