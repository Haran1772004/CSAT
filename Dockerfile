# Stage 1: Builder
FROM python:3.10-slim as builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# We install poetry here just to get the packages
RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock* /app/
RUN poetry install --no-interaction --no-ansi --no-root

# Stage 2: Final
FROM python:3.10-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# 1. Copy the packages from the builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 2. IMPORTANT: You MUST install poetry in this final stage too 
# so 'docker compose exec app poetry run' actually works!
RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY . /app
COPY ./scripts/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000
CMD ["/start.sh"]