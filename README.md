# Dynamic CV as an API

A full-stack resume application serving your CV as a REST API, with a React frontend and Prometheus metrics ready for Grafana dashboarding.

**Stack:** Python 3.11+ · FastAPI · SQLAlchemy (async) · PostgreSQL · React 18 · Vite · prometheus-client

---

## Project Structure

```
app-devops/
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI entry point
│   │   ├── config.py       # Settings from .env
│   │   ├── database.py     # Async SQLAlchemy engine
│   │   ├── models.py       # ORM models (profile, experience, skills, visitors)
│   │   ├── schemas.py      # Pydantic response schemas
│   │   ├── metrics.py      # Prometheus counters + middleware
│   │   └── routers/
│   │       ├── profile.py
│   │       ├── experience.py
│   │       ├── skills.py
│   │       └── metrics.py
│   ├── seed.py             # One-time DB seed with sample CV data
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/cvApi.js
│   │   ├── components/
│   │   │   ├── Profile.jsx
│   │   │   ├── Experience.jsx
│   │   │   └── Skills.jsx
│   │   └── styles/main.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Full profile object (name, title, summary, contacts) |
| GET | `/api/experience` | List of work experience entries, ordered by date |
| GET | `/api/skills` | Skills grouped by category with proficiency levels |
| GET | `/api/metrics` | Prometheus metrics (scrape target) |
| GET | `/health` | Health check — `{"status": "ok"}` |
| GET | `/api/docs` | Interactive Swagger UI |
| GET | `/api/redoc` | ReDoc documentation |

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (local or remote)

### 1. Database Setup

Create the database:
```sql
CREATE DATABASE cv_db;
```

### 2. Backend

```bash
cd backend

# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and set your DATABASE_URL

# Seed the database with sample CV data (run once)
python seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`
Swagger UI at `http://localhost:8000/api/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`
The Vite dev proxy forwards `/api/*` requests to the backend automatically.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL async connection string | `postgresql+asyncpg://postgres:password@localhost:5432/cv_db` |
| `APP_PORT` | Backend server port | `8000` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |

---

## Prometheus Metrics

The `/api/metrics` endpoint exposes metrics in the Prometheus text exposition format (version 0.0.4).

### Available Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `cv_api_requests_total` | Counter | `endpoint`, `method`, `status_code` | Total API requests |
| `cv_api_request_duration_seconds` | Histogram | `endpoint` | Request duration in seconds |
| `cv_visitors_total` | Counter | — | Total unique CV visitors |

### Prometheus Scrape Configuration

Add to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'cv-api'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/api/metrics'
```

### Grafana Dashboard Queries

Once Prometheus is scraping, use these PromQL queries in Grafana:

**Total API Requests (by endpoint)**
```promql
sum by (endpoint) (cv_api_requests_total)
```

**Request Rate (5-minute window)**
```promql
rate(cv_api_requests_total[5m])
```

**P95 Request Latency**
```promql
histogram_quantile(0.95, rate(cv_api_request_duration_seconds_bucket[5m]))
```

**Unique Visitors**
```promql
cv_visitors_total
```

**Error Rate (non-2xx responses)**
```promql
sum(rate(cv_api_requests_total{status_code!~"2.."}[5m])) / sum(rate(cv_api_requests_total[5m]))
```

---

## Customizing Your CV

All CV content is stored in the database. To update it:

1. Edit the sample data directly in `backend/seed.py`
2. Re-run `python seed.py` (the script is idempotent — it skips existing rows)
3. Or connect to your PostgreSQL database directly and `UPDATE` the rows

---

## Production Notes

- Run with a production ASGI server: `uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000`
- Build the frontend for production: `cd frontend && npm run build` (outputs to `frontend/dist/`)
- Serve the `dist/` folder via Nginx or configure FastAPI to serve static files
- Use environment variables (not `.env` files) in production deployments

---

## CI/CD Pipeline

Every push to `main` triggers a two-job GitHub Actions workflow:

```
push to main
    │
    ▼
[build-and-push]
    ├── docker build backend  → DockerHub  (sha tag + latest)
    └── docker build frontend → DockerHub  (sha tag + latest)
    │
    ▼
[deploy]
    ├── scp docker-compose.prod.yml → production server
    ├── write .env from GitHub Secrets
    ├── docker compose pull
    ├── docker compose up -d --remove-orphans
    └── docker image prune -f
```

### Required GitHub  Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (not your password — create one at hub.docker.com → Account Settings → Security) |
| `PROD_HOST` | Production server IP or hostname |
| `PROD_USER` | SSH user on the server (e.g. `ubuntu`, `root`) |
| `PROD_SSH_KEY` | Private SSH key (contents of `~/.ssh/id_rsa`) |
| `PROD_PORT` | SSH port (optional, defaults to `22`) |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins (e.g. `https://yourdomain.com`) |
Please note that the workflow file specifies the **"cv-devops-env"** secret environment
### One-time server setup

SSH into your production server and install Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

That's all — the pipeline handles everything else on every deploy.

### Manual trigger

The workflow also has `workflow_dispatch`, so you can re-deploy any time from the GitHub Actions tab without pushing new code.
