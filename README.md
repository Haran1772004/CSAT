# CSAT Backend System

A production-ready, multi-tenant CSAT (Customer Satisfaction) backend built with FastAPI, SQLAlchemy, and AWS S3.

## Tech Stack
- **Framework**: FastAPI
- **Database**: MySQL (SQLAlchemy + PyMySQL)
- **Auth**: JWT (OAuth2PasswordBearer)
- **Storage**: AWS S3 (via Boto3)
- **DevOps**: Docker, Nginx, GitHub Actions
- **Dep Management**: Poetry

## Features
- **Admin**: Register, Login, Create Forms, View Analytics (Aggregated ratings).
- **Public**: Submit feedback (Rate limited, Captures IP, Upload Screenshot).
- **Security**: BCrypt hashing, Role-based access (Ownership), File validation.

## Local Setup

### Prerequisites
- Docker & Docker Compose
- Poetry (optional, if running locally without Docker)

### Running with Docker (Recommended)
1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd csat-backend
   ```
2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in credentials.
   ```bash
   cp .env.example .env
   ```
3. **Build and Run**
   ```bash
   docker-compose up --build
   ```
   The API will be available at `http://localhost:80` (via Nginx) or `http://localhost:8000` (Direct).

### Running Manually
1. **Install Dependencies**
   ```bash
   poetry install
   ```
2. **Run Migrations**
   ```bash
   poetry run alembic upgrade head
   ```
3. **Start Server**
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

## API Documentation
Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure
```
app/
├── api/             # API Endpoints & Dependencies
├── core/            # Config, Security, Logging
├── db/              # Database Session & Models
├── models/          # SQLAlchemy Models
├── schemas/         # Pydantic Schemas
├── services/        # Business Logic (S3, etc)
└── main.py          # Entry Point
```

## Deployment
The project includes a GitHub Actions workflow `.github/workflows/deploy.yml` that:
1. Lints the code.
2. Runs tests (if enabled).
3. Can be configured to deploy to AWS EC2 via SSH.
