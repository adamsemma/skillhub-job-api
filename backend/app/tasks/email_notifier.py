from celery import Celery
from loguru import logger
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
import os

from ..config import settings

# Celery app (would be configured in celery.py)
celery_app = Celery('tasks')

@celery_app.task
def send_job_match_email(user_email: str, matches: List[Dict[str, Any]]):
    """Send job match notifications via email"""
    try:
        # Email configuration
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER', '')
        smtp_password = os.getenv('SMTP_PASSWORD', '')
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Job Matches Found! ({len(matches)})"
        msg['From'] = smtp_user
        msg['To'] = user_email
        
        # HTML content
        html = f"""
        <html>
        <body>
            <h2>🎯 New Job Matches Found!</h2>
            <p>We found <strong>{len(matches)}</strong> jobs matching your skills:</p>
            <ul>
        """
        for match in matches[:5]:
            html += f"""
                <li>
                    <strong>{match.get('title', 'Unknown')}</strong> at {match.get('company', 'Unknown')}
                    <br>Match Score: {match.get('match_score', 0):.0f}%
                </li>
            """
        html += """
            </ul>
            <p>View all matches at: https://skillhub.meritlives.com/matches</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [user_email], msg.as_string())
            
        logger.info(f"Email sent to {user_email}")
        return {"status": "sent", "user": user_email}
        
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
        return {"status": "failed", "error": str(e)}

@celery_app.task
def send_daily_digest(user_id: str):
    """Send daily job match digest"""
    # Would aggregate matches from past 24 hours
    logger.info(f"Sending daily digest to user {user_id}")
    return {"status": "scheduled"}