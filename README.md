# CSAT Backend - Customer Satisfaction System

A high-performance Customer Satisfaction (CSAT) backend powered by **FastAPI**. This system is designed to capture, process, and analyze customer feedback signals in real-time using a "Sense & Respond" architecture.

---

## 🚀 Core Features

- **Multi-Tenant Architecture**: Securely manage multiple forms and organizations with distinct ownership.
- **Real-time Signal Capture**: Distributed feedback collection with automated IP tracking and rate limiting.
- **Active Analytics**: Integrated processing for 30, 60, and 90-day sentiment trends and distribution analysis.
- **Automated Media Handling**: Direct streaming of customer screenshots to **AWS S3** for secure storage.
- **Data Intelligence**: Exportable feedback data in Excel format (Bulk & Single) for deep offline analysis.
- **Enterprise Security**: JWT-based authentication with BCrypt password hashing and robust CORS protection.

---

## 🛠️ Technical Stack

- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLAlchemy + MySQL 8.0
- **Migrations**: Alembic
- **Auth**: JWT (OAuth2) + BCrypt
- **Cloud Storage**: AWS S3 (via Boto3)
- **Rate Limiting**: SlowAPI
- **Data Processing**: Pandas + OpenPyXL
- **Containerization**: Docker & Docker Compose

---

## 📡 API Endpoints

The API is versioned under `/api/v1/`. Full interactive documentation is available at `/docs` when running locally.

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new administrator account |
| `POST` | `/auth/login/access-token` | Obtain JWT access token (OAuth2) |

### Form Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/forms/` | Create a new CSAT feedback form |
| `GET` | `/forms/` | List all forms owned by the current user |
| `GET` | `/forms/{id}` | Get detailed configuration for a specific form |

### Submissions & Feedback
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/submit/{form_id}` | **Public**: Submit customer feedback (supports rating, text, and screenshot) |
| `GET` | `/forms/{form_id}/submissions` | List all submissions for a specific form (Owner only) |
| `GET` | `/submissions/{id}` | View a single submission detail |

### Data Export & Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/{form_id}/analytics` | Get 30/60/90 day trends and rating distribution |
| `GET` | `/submissions/{id}/download` | Download a single submission as Excel |
| `GET` | `/forms/{form_id}/download/bulk` | Download all form submissions as a bulk Excel report |

### System Utility
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Check API service and CI/CD status |

---

## 💻 Setup & Execution

### 1. Prerequisites
- **Docker & Docker Compose**
- **AWS S3 Credentials** (configured in `.env`)

### 2. Configuration
Copy the template environment file and update with your credentials:
```bash
cp .env.example .env
```

### 3. Launch with Docker
The system uses `docker-compose` to orchestrate the FastAPI app, MySQL database, and Nginx reverse proxy.
```bash
# Build and start all services
docker-compose up --build
```
*   **API Docs**: `http://localhost:8000/docs`
*   **Health Check**: `http://localhost:8000/health`

### 4. Database Migrations
Migrations are handled automatically by the startup script (`scripts/start.sh`) inside the container using Alembic:
```bash
alembic upgrade head
```

---

*Designed for high-performance service monitoring.*
