FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright
RUN playwright install chromium
RUN playwright install-deps

# Copy application
COPY . .

# WEB_CONCURRENCY controls how many worker processes run in this container.
# A single uvicorn process only uses one CPU core; gunicorn + uvicorn
# workers lets it use all of them. Tune this to roughly (2 x CPU cores) + 1
# per container, then scale further by running more container replicas
# behind a load balancer -- see README "Scaling & capacity".
ENV WEB_CONCURRENCY=4
EXPOSE 8001

CMD gunicorn app.main:app \
    --workers ${WEB_CONCURRENCY} \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8001 \
    --timeout 60 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile -
