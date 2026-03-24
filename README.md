# Dynamic CV as an API

A production-ready full-stack application that serves a resume as a REST API. Built as a DevOps portfolio project — demonstrating containerization, CI/CD automation, database migrations, reverse proxying, and observability with Prometheus and Grafana.

**Stack:** FastAPI · PostgreSQL · React 18 · Nginx · Docker · GitHub Actions · Prometheus · Grafana

---

## Architecture

```
                         ┌─────────────────────────────────────┐
                         │         Production Server           │
                         │                                     │
  Browser ──────────────▶│  Nginx :80                          │
                         │    ├── /* ──────▶ React SPA (dist/) │
                         │    └── /api/* ──▶ FastAPI :8000      │
                         │                      │              │
                         │                  PostgreSQL         │
                         └─────────────────────────────────────┘
                                               │
                                        GET /api/metrics
                                               │
                         ┌─────────────────────▼───────────────┐
                         │       Monitoring Server             │
                         │                                     │
                         │  Prometheus :9090 ──▶ Grafana :3000 │
                         └─────────────────────────────────────┘
```

---

## Project Structure

```
app-devops/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app, CORS, middleware, lifespan
│   │   ├── config.py         # Settings via pydantic-settings (.env)
│   │   ├── database.py       # Async SQLAlchemy engine + get_db() dep
│   │   ├── models.py         # ORM models: profile, experience, skills, visitors
│   │   ├── schemas.py        # Pydantic response schemas
│   │   ├── metrics.py        # Prometheus counters + PrometheusMiddleware
│   │   └── routers/
│   │       ├── profile.py    # GET /api/profile  (+ visitor tracking)
│   │       ├── experience.py # GET /api/experience
│   │       ├── skills.py     # GET /api/skills
│   │       └── metrics.py    # GET /api/metrics  (Prometheus scrape target)
│   ├── migrations/           # Alembic migrations
│   │   └── versions/
│   ├── Dockerfile
│   ├── entrypoint.sh         # alembic upgrade head → seed → uvicorn
│   ├── seed.py               # Idempotent DB seed with sample CV data
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Root component, parallel data fetching
│   │   ├── api/cvApi.js      # Axios wrappers for all API calls
│   │   ├── components/
│   │   │   ├── Profile.jsx   # Avatar, contacts, summary
│   │   │   ├── Experience.jsx# Timeline of work history
│   │   │   └── Skills.jsx    # Skills grouped by category + level bars
│   │   └── styles/main.css   # Responsive resume styles, skeleton loading
│   ├── nginx.conf            # SPA fallback + /api proxy to backend
│   ├── Dockerfile            # Multi-stage: node build → nginx serve
│   ├── vite.config.js
│   └── package.json
├── monitoring/
│   ├── docker-compose.monitoring.yml  # Prometheus + Grafana stack
│   ├── prometheus.yml                 # Scrape config for cv-api
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/  # Auto-connects Prometheus as datasource
│       │   └── dashboards/   # Auto-loads dashboards from folder
│       └── dashboards/
│           └── cv_api.json   # Ready-made dashboard (8 panels)
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD: build → push DockerHub → SSH deploy
├── docker-compose.yaml       # Local development stack
├── docker-compose.prod.yml   # Production stack (pulls images from DockerHub)
└── .env.example              # Root env template for Docker Compose
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Profile object + triggers unique visitor counter |
| GET | `/api/experience` | Work history, ordered by date |
| GET | `/api/skills` | Skills grouped by category with proficiency levels |
| GET | `/api/metrics` | Prometheus scrape target (text exposition format) |
| GET | `/health` | Health check — `{"status": "ok"}` |
| GET | `/api/docs` | Swagger UI |
| GET | `/api/redoc` | ReDoc |

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (local install or cloud)

### 1. Create the database
```sql
CREATE DATABASE cv_db;
```

### 2. Backend
```bash
cd backend

python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
copy .env.example .env        # then edit DATABASE_URL

alembic upgrade head          # run migrations
python seed.py                # populate with sample data (run once)

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:8000` automatically.

---

## Docker (local stack)

```bash
cp .env.example .env   # fill in DB_USER, DB_PASSWORD, DB_NAME
docker compose up --build -d
```

App available at `http://localhost:80`.

---

## Environment Variables

### Root `.env` — used by `docker-compose.yaml` and `docker-compose.prod.yml`

| Variable | Description |
|----------|-------------|
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `DB_PORT` | PostgreSQL host port (dev only) |
| `DOCKERHUB_USERNAME` | DockerHub username (prod only) |
| `IMAGE_TAG` | Image tag to pull (prod only, set by CI) |

### `backend/.env` — used for local development without Docker

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...@localhost:5432/cv_db` | Full async connection string |
| `APP_PORT` | `8000` | Backend port |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | CORS origins (not needed behind Nginx) |

---

## Database Migrations (Alembic)

Alembic reads `DATABASE_URL` from the environment — no credentials in `alembic.ini`.

```bash
# Apply all pending migrations
alembic upgrade head

# Generate a new migration after changing models.py
alembic revision --autogenerate -m "add column X"

# Roll back one step
alembic downgrade -1
```

The `entrypoint.sh` in the backend container runs `alembic upgrade head` and `python seed.py` automatically on every container start before launching uvicorn.

---

## Prometheus Metrics

`GET /api/metrics` returns data in Prometheus text exposition format, scraped every 15 seconds.

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `cv_api_requests_total` | Counter | `endpoint`, `method`, `status_code` | Every HTTP response |
| `cv_api_request_duration_seconds` | Histogram | `endpoint` | Request duration (P50/P95/P99) |
| `cv_visitors_total` | Counter | — | Unique visitors (deduped via PostgreSQL) |

---

## Monitoring Stack (Prometheus + Grafana)

Runs as a separate stack on a dedicated monitoring server.

```bash
cd monitoring
cp .env.example .env          # set GRAFANA_PASSWORD

# Replace with your production server IP
sed -i 's/CV_API_HOST/YOUR_PROD_IP/' prometheus.yml

docker compose -f docker-compose.monitoring.yml up -d
```

- **Prometheus** — `http://<monitoring-server>:9090`
- **Grafana** — `http://<monitoring-server>:3000` (default login: `admin` / your password)

The **"Dynamic CV — API Metrics"** dashboard loads automatically via provisioning. No manual import needed.

### Dashboard panels

| Panel | PromQL | What it shows |
|-------|--------|---------------|
| Total requests | `sum(cv_api_requests_total)` | Lifetime request count |
| Unique visitors | `cv_visitors_total` | Cumulative unique IPs |
| Error rate | `rate(5xx) / rate(all)` | Fraction of failed requests |
| P95 latency | `histogram_quantile(0.95, ...)` | 95th percentile response time |
| Request rate by endpoint | `sum by (endpoint) rate(...)` | Traffic per route |
| Latency P50/P95/P99 | `histogram_quantile(0.5/0.95/0.99, ...)` | Full latency distribution |
| HTTP status codes | `rate` grouped by `status_code` | 2xx / 4xx / 5xx over time |
| Visitor growth | `cv_visitors_total` | Cumulative unique visitors over time |

---

## CI/CD Pipeline

Every push to `main` triggers a GitHub Actions workflow:

```
push to main
    │
    ▼
[build-and-push]
    ├── docker build backend  → DockerHub  :<sha8> + :latest
    └── docker build frontend → DockerHub  :<sha8> + :latest
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

**Settings → Secrets and variables → Actions → Environment: `cv-devops-env`**

| Secret | Where to get it |
|--------|----------------|
| `DOCKERHUB_USERNAME` | Your DockerHub login |
| `DOCKERHUB_TOKEN` | hub.docker.com → Account Settings → Security → New Access Token |
| `PROD_HOST` | Production server IP or hostname |
| `PROD_USER` | SSH user (`ubuntu`, `root`, etc.) |
| `PROD_SSH_KEY` | Contents of `~/.ssh/id_rsa` (private key) |
| `PROD_PORT` | SSH port (optional, default `22`) |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `ALLOWED_ORIGINS` | `https://yourdomain.com` |

### One-time server setup

The pipeline installs Docker automatically if it's not present. Nothing needs to be done manually on the server.

### Manual trigger

The workflow supports `workflow_dispatch` — re-deploy any time from the GitHub Actions tab without a code push.

---

## Customizing CV Content

All content is stored in PostgreSQL. To update:

1. Edit `backend/seed.py` with your real data
2. Run `python seed.py` — it's idempotent, skips already existing rows
3. Or `UPDATE` rows directly in the database
