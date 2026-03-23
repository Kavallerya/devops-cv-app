# Dynamic CV as an API

A full-stack resume application serving your CV as a REST API, with a React frontend, PostgreSQL database, CI/CD via GitHub Actions, and a Prometheus + Grafana monitoring stack.

**Stack:** Python 3.11+ · FastAPI · SQLAlchemy (async) · Alembic · PostgreSQL · React 18 · Vite · Nginx · Docker · prometheus-client · Grafana

---

## Project Structure

```
app-devops/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point, CORS, middleware, lifespan
│   │   ├── config.py           # Settings from .env (pydantic-settings)
│   │   ├── database.py         # Async SQLAlchemy engine + get_db() dependency
│   │   ├── models.py           # ORM models: profile, experience, skills, visitors
│   │   ├── schemas.py          # Pydantic response schemas
│   │   ├── metrics.py          # Prometheus counters, histogram, middleware
│   │   └── routers/
│   │       ├── profile.py      # GET /api/profile  (+ visitor deduplication)
│   │       ├── experience.py   # GET /api/experience
│   │       ├── skills.py       # GET /api/skills
│   │       └── metrics.py      # GET /api/metrics  (Prometheus scrape target)
│   ├── migrations/
│   │   ├── versions/           # Alembic migration files
│   │   └── env.py              # Alembic env — wired to app models + .env URL
│   ├── Dockerfile
│   ├── entrypoint.sh           # alembic upgrade head → seed.py → uvicorn
│   ├── alembic.ini
│   ├── seed.py                 # Idempotent DB seed with sample CV data
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Root component, parallel data fetching
│   │   ├── api/cvApi.js        # Axios wrappers for all API calls
│   │   ├── components/
│   │   │   ├── Profile.jsx
│   │   │   ├── Experience.jsx
│   │   │   └── Skills.jsx
│   │   └── styles/main.css
│   ├── nginx.conf              # SPA fallback + /api proxy to backend
│   ├── Dockerfile              # Multi-stage: node build → nginx:alpine
│   ├── vite.config.js          # Dev proxy: /api → localhost:8000
│   └── package.json
├── monitoring/
│   ├── docker-compose.monitoring.yml   # Prometheus + Grafana stack
│   ├── prometheus.yml                  # Scrape config (target: cv-api)
│   ├── .env.example                    # GRAFANA_USER / GRAFANA_PASSWORD
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/prometheus.yml   # Auto-connects Prometheus
│       │   └── dashboards/dashboards.yml    # Auto-loads dashboards from folder
│       └── dashboards/
│           └── cv_api.json              # Ready-made dashboard (8 panels)
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build → push DockerHub → deploy via SSH
├── docker-compose.yaml         # Local development stack (with build:)
├── docker-compose.prod.yml     # Production stack (pre-built images from DockerHub)
├── .env.example                # DB_USER / DB_PASSWORD / DB_NAME / DB_PORT
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Full profile object (name, title, summary, contacts) |
| GET | `/api/experience` | Work experience list ordered by date |
| GET | `/api/skills` | Skills grouped by category with proficiency levels |
| GET | `/api/metrics` | Prometheus metrics scrape target |
| GET | `/health` | Health check — `{"status": "ok"}` |
| GET | `/api/docs` | Swagger UI |
| GET | `/api/redoc` | ReDoc |

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (local or remote)
- Docker + Docker Compose (optional, for full stack)

### Option A — Docker Compose (recommended)

```bash
cp .env.example .env        # fill in DB_USER, DB_PASSWORD, DB_NAME
docker compose up --build -d
```

App: `http://localhost` · API docs: `http://localhost/api/docs`

### Option B — Without Docker

**1. Create the database**
```sql
CREATE DATABASE cv_db;
```

**2. Backend**
```bash
cd backend

# Windows
python -m venv .venv && .venv\Scripts\activate
# macOS / Linux
python -m venv .venv && source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # set DATABASE_URL

alembic upgrade head        # create tables
python seed.py              # populate with sample data
uvicorn app.main:app --reload --port 8000
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173  (proxies /api → :8000)
```

---

## Environment Variables

### Root `.env` (Docker Compose)

| Variable | Description |
|----------|-------------|
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `DB_PORT` | PostgreSQL port (default `5432`) |

### `backend/.env` (local dev without Docker)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/cv_db` | SQLAlchemy async connection string |
| `APP_PORT` | `8000` | Backend server port |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | CORS origins (not needed behind Nginx) |

---

## Database Migrations (Alembic)

Alembic reads `DATABASE_URL` from `.env` automatically — no credentials in `alembic.ini`.

```bash
cd backend

# Apply all pending migrations
alembic upgrade head

# Generate a new migration after changing models.py
alembic revision --autogenerate -m "add field X"

# Check current revision
alembic current

# Roll back one step
alembic downgrade -1
```

In Docker, `entrypoint.sh` runs `alembic upgrade head` + `seed.py` automatically before starting uvicorn.

---

## Nginx (Frontend)

`frontend/nginx.conf` handles two things:

- **SPA routing** — `try_files $uri $uri/ /index.html` so refreshing `/experience` doesn't 404
- **API proxy** — `location /api/` proxies to `http://backend:8000`, eliminating CORS entirely in production

---

## Prometheus Metrics

`GET /api/metrics` exposes metrics in Prometheus text format (v0.0.4). Instrumented via `PrometheusMiddleware` in `app/metrics.py`.

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `cv_api_requests_total` | Counter | `endpoint`, `method`, `status_code` | Total HTTP requests |
| `cv_api_request_duration_seconds` | Histogram | `endpoint` | Request duration |
| `cv_visitors_total` | Counter | — | Unique visitors (deduplicated by IP hash in PostgreSQL) |

---

## Monitoring Stack (Prometheus + Grafana)

Runs as a separate Docker Compose stack on a dedicated monitoring server.

### Setup

```bash
cd monitoring

# 1. Set the production server IP in prometheus.yml
#    Replace CV_API_HOST with your actual server IP or hostname
vi prometheus.yml

# 2. Configure Grafana credentials
cp .env.example .env

# 3. Start
docker compose -f docker-compose.monitoring.yml up -d
```

Grafana: `http://<monitoring-server>:3000`
Prometheus: `http://<monitoring-server>:9090`

### Auto-provisioned Dashboard

The **"Dynamic CV — API Metrics"** dashboard loads automatically on first start (no manual import needed) via Grafana provisioning.

**8 panels:**

| Panel | PromQL | What it shows |
|-------|--------|---------------|
| Total requests | `sum(cv_api_requests_total)` | All-time request counter |
| Unique visitors | `cv_visitors_total` | Unique IPs seen |
| Error rate | `rate(5xx) / rate(all)` | Fraction of server errors |
| P95 latency | `histogram_quantile(0.95, ...)` | 95th percentile response time |
| Request rate by endpoint | `sum by (endpoint) (rate(...[5m]))` | Per-route traffic |
| Latency P50/P95/P99 | `histogram_quantile` × 3 | Latency distribution |
| HTTP status codes | `rate` by `2xx / 4xx / 5xx` | Response code breakdown |
| Visitor growth | `cv_visitors_total` over time | Cumulative unique visitors |

---

## CI/CD Pipeline

Every push to `main` triggers `.github/workflows/deploy.yml`:

```
push to main
    │
    ▼
[build-and-push]
    ├── docker build backend  → DockerHub  (sha8 tag + latest)
    └── docker build frontend → DockerHub  (sha8 tag + latest)
    │
    ▼
[deploy]
    ├── Install Docker on server (if not present)
    ├── scp docker-compose.prod.yml → ~/cv-app/
    ├── Write .env from GitHub Secrets
    ├── docker compose pull
    ├── docker compose up -d --remove-orphans
    └── docker image prune -f
```

### Required GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (hub.docker.com → Account Settings → Security) |
| `PROD_HOST` | Production server IP or hostname |
| `PROD_USER` | SSH user (`ubuntu`, `root`, etc.) |
| `PROD_SSH_KEY` | Private SSH key (contents of `~/.ssh/id_rsa`) |
| `PROD_PORT` | SSH port (optional, defaults to `22`) |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `ALLOWED_ORIGINS` | Allowed CORS origins (not critical behind Nginx) |

Secrets must be placed in the **`cv-devops-env`** GitHub environment (the workflow references `environment: cv-devops-env`).

### Manual trigger

The workflow has `workflow_dispatch` — re-deploy any time from the GitHub Actions tab without a code push.

---

## Customizing CV Content

All content is stored in PostgreSQL. To update:

1. Edit `backend/seed.py` with your real data
2. Run `python seed.py` again — it is idempotent (skips existing rows)
3. Or `UPDATE` rows directly in the database
