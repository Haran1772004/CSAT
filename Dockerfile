# Dockerfile
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy only dependency files configuration to cache them in docker layer
COPY pyproject.toml poetry.lock* /app/

# Configure poetry to create virtualenv in the project directory
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Install database dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python dependencies from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . /app

# Expose port
EXPOSE 8000

# Copy startup script
COPY ./scripts/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
