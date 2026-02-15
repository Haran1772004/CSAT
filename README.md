# ☕ Divine Coffee Intelligence (CSAT System)

A premium, production-ready Customer Satisfaction (CSAT) monitoring system tailored for **Divine Coffee Shop**. This system utilizes a "Sense & Respond" architecture to capture real-time customer signals via distributed sensors (feedback forms) and process them into actionable intelligence.

---

## 🛠️ Technical Stack
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy + MySQL, JWT Auth.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn/UI.
- **Infrastructure**: AWS S3 (Storage), Nginx (Reverse Proxy), Docker + Docker Compose.
- **DevOps**: GitHub Actions (CI/CD), DuckDNS (Dynamic DNS).

---

## 🚀 The Divine Story: "Sense & Respond"
The system is divided into two distinct portals:
1. **Divine Control Hub**: An executive dashboard for managers to monitor service health, analyze 30/60/90 day trends, and track specific customer signals (mapped to `GET /api/v1/reports/`).
2. **Customer Signal Portal**: A lightweight, public-facing interface for customers to report their experience with specific shop services (e.g., *Divine Barista Quality*).

---

## 💻 Local Setup & Development

### 1. Prerequisites
- **Docker Desktop** (Required for the full stack).
- **Node.js 20+** (If running frontend outside Docker).
- **WSL2** (Recommended for Windows users).

### 2. Quick Start (Docker)
```bash
# Clone the repository
git clone <repo-url>
cd csat-divine

# Configure Environment
cp .env.example .env

# Launch the Hub
docker-compose up --build
```
*   **Admin Hub**: `http://localhost:3000`
*   **API Docs**: `http://localhost:8000/docs`

---

## ⚠️ Common Deployment Obstacles (Troubleshooting)

### 🔴 Local/WSL Build Issues
- **Path Conflicts**: If using Windows, avoid running `npm` commands directly on `/mnt/c/` paths. Always use the WSL home directory (`~/`) to avoid performance lags and permission errors.
- **Node Modules & TSC**: If `npm run build` fails with `tsc` errors, ensure `typescript` is installed as a devDependency. If you see duplicate library warnings (e.g., `lucide-react`), check `package.json` for redundant entries.
- **Port Conflicts**: Ensure ports `3000`, `8000`, and `3306` are not occupied by existing local services.

### 🟡 EC2 & Production (Nginx)
- **CORS Errors**: If the frontend cannot reach the backend on EC2, verify your `.env` has `BACKEND_CORS_ORIGINS=["http://apihari.duckdns.org", "https://apihari.duckdns.org"]`.
- **Nginx Size Limits**: If screenshot uploads fail, ensure `client_max_body_size 20M;` is present in your Nginx config.
- **DNS (DuckDNS)**: If the site is unreachable, verify your public IP in DuckDNS matches your EC2 instance and ensure Nginx `server_name` is set to your domain.

---

## 📂 Project Architecture
```
/
├── app/                # FastAPI Backend Logic
├── frontend/           # React + Vite Frontend
│   ├── src/App.tsx     # The Divine Hub Dashboard
│   └── src/services/   # API Layer & Mock Service
├── docker/             # Nginx & Environment configs
└── docker-compose.yml  # Multi-container orchestration
```

## 🔐 Security & Operations
- **Data Integrity**: Passwords hashed with BCrypt; tokens signed with JWT.
- **Storage**: Customer screenshots are streamed directly to AWS S3.
- **IP Tracking**: Every submission captures the respondent's IP to prevent signal spam.

---

*Designed for high-performance service monitoring. Stay Divine.*
