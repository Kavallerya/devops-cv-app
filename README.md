# Dynamic CV Platform — GitOps-Driven Full-Stack Portfolio

[![CI/CD](https://img.shields.io/github/actions/workflow/status/Kavallerya/devops-cv-app/deploy.yml?branch=main&label=CI%2FCD&logo=githubactions&logoColor=white)](https://github.com/Kavallerya/devops-cv-app/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Kubernetes](https://img.shields.io/badge/GKE-1.30-326CE5?logo=kubernetes&logoColor=white)](https://cloud.google.com/kubernetes-engine)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-EF7B4D?logo=argo&logoColor=white)](https://argo-cd.readthedocs.io/)
[![Terraform](https://img.shields.io/badge/Terraform-GCP-7B42BC?logo=terraform&logoColor=white)](https://www.terraform.io/)

A production-grade CV/portfolio platform deployed on **GCP GKE** with **ArgoCD GitOps**,
demonstrating a FastAPI backend, React/Vite frontend, PostgreSQL, and a full observability
stack (Prometheus, Loki, Grafana with OIDC auth).

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure & GitOps](#infrastructure--gitops)
- [Observability](#observability)
- [Security](#security)

---

## Architecture

> **Production topology** — deployed on GCP GKE, managed via ArgoCD GitOps.

```
                        Internet
                           │
                   ┌───────▼─────────┐
                   │  Cloudflare DNS  │  imorozov.xyz
                   └───────┬─────────┘
                           | TLS (Let's Encrypt)
                   ┌───────▼─────────┐
                   │    GCP GKE      │  europe-central2
                   │ ┌───────┬──────┐ │
                   │ │ Nginx        │ │  ingress-nginx
                   │ │ Ingress      │ │
                   │ └─┬───────┬───┘ │
                   │   │       │     │
                   │   ▼       ▼     │
                   │ Frontend  Backend│
                   │  :80      :8000 │
                   │   │       │     │
                   │   │       ▼     │
                   │   │   PostgreSQL│  PVC 5Gi
                   │   │    :5432    │
                   │   │             │
                   │   └─Observability──┐
                   │      Prometheus    │
                   │       Grafana      │  Dex OIDC (GitHub)
                   │         Loki        │
                   └───────────────────┘
```

| Domain | Target | Auth |
|---|---|---|
| `imorozov.xyz` | React SPA (Nginx) | Public |
| `api.imorozov.xyz` | FastAPI REST API | Public |
| `auth.imorozov.xyz` | Dex OIDC Provider | Public (OAuth) |
| `monitor.imorozov.xyz` | Grafana Dashboard | Dex → GitHub (org-restricted) |

---

## Tech Stack

### Core Application

[![Python](https://img.shields.io/badge/Python-3.11-366D9C?logo=python&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688?logo=fastapi&logoColor=white)]()
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)]()
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss&logoColor=white)]()
[![FramerMotion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?logo=framer&logoColor=white)]()

### Data & Backend Libraries

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)]()
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-306998?logo=sqlalchemy&logoColor=white)]()
[![Alembic](https://img.shields.io/badge/Alembic-1.14-306998?logo=alembic&logoColor=white)]()
[![Uvicorn](https://img.shields.io/badge/Uvicorn-0.34-2094F3?logo=uvicorn&logoColor=white)]()

### DevOps & Infrastructure

[![Docker](https://img.shields.io/badge/Docker-27-2496ED?logo=docker&logoColor=white)]()
[![Kubernetes](https://img.shields.io/badge/GKE-1.30-326CE5?logo=kubernetes&logoColor=white)]()
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-EF7B4D?logo=argo&logoColor=white)]()
[![Terraform](https://img.shields.io/badge/Terraform-GCP-7B42BC?logo=terraform&logoColor=white)]()
[![GitHubActions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions&logoColor=white)]()
[![Helm](https://img.shields.io/badge/Helm-3.0-0F1689?logo=helm&logoColor=white)]()
[![Cert-Manager](https://img.shields.io/badge/Cert_Manager-v1.14-2496ED?logo=letsencrypt&logoColor=white)]()

### Observability

[![Prometheus](https://img.shields.io/badge/Prometheus-2.51-FF4000?logo=prometheus&logoColor=white)]()
[![Grafana](https://img.shields.io/badge/Grafana-10.4-F46800?logo=grafana&logoColor=white)]()
[![Loki](https://img.shields.io/badge/Loki-2.10-F46800?logo=grafana&logoColor=white)]()
[![Trivy](https://img.shields.io/badge/Trivy-CVE_Scan-4C4C4C?logo=aqua&logoColor=white)]()

---

## Project Structure

Two repositories — application source and infrastructure-as-code:

```
devops-cv-app/                       # [REPO A] Application source + CI/CD
├── .github/workflows/
│   ├── deploy.yml                   # Main CI/CD pipeline
│   └── monitoring-deploy.yml        # Standalone monitoring deploy
│
├── backend/                         # FastAPI backend (Python 3.11)
│   ├── app/
│   │   ├── main.py                  # FastAPI factory, CORS, Instrumentator
│   │   ├── config.py                # Pydantic settings (env-based)
│   │   ├── database.py              # async SQLAlchemy engine + session
│   │   ├── models.py                # 8 ORM models
│   │   ├── schemas.py               # Pydantic response schemas
│   │   ├── metrics.py               # Prometheus counters
│   │   └── routers/                 # 9 API routers
│   │       ├── profile.py           ├── experience.py        ├── skills.py
│   │       ├── status.py            ├── certifications.py    ├── projects.py
│   │       ├── education.py         ├── contact.py           └── github.py
│   ├── migrations/                  # Alembic migrations (3)
│   ├── Dockerfile                   # Multi-stage (python:3.11-slim)
│   ├── entrypoint.sh                # Alembic upgrade → seed → uvicorn
│   ├── seed.py                     # Idempotent DB seeder
│   └── requirements.txt
│
├── frontend/                        # React 18 + Vite 6 SPA
│   ├── src/
│   │   ├── main.jsx                 # ReactDOM entry
│   │   ├── App.jsx                  # Root component (Promise.all)
│   │   ├── api/                     # Axios API client
│   │   │   ├── cvApi.js             # Primary API instance
│   │   │   └── dashboardApi.js      # Dashboard-specific calls
│   │   ├── context/                 # Theme provider (dark/light)
│   │   └── components/              # 15 React components
│   │       ├── Header.jsx           ├── Footer.jsx
│   │       ├── MetricsBar.jsx       ├── ProfileHero.jsx
│   │       ├── SkillsDashboard.jsx  ├── ExperienceTimeline.jsx
│   │       ├── ProjectsGrid.jsx     ├── Education.jsx
│   │       ├── CertificationsGrid.jsx  ├── GitHubActivity.jsx
│   │       ├── ContactForm.jsx      ├── ArchitectureModal.jsx
│   │       ├── SectionHeading.jsx   ├── SkeletonCard.jsx
│   │       ├── ScrollReveal.jsx    ├── ThemeToggle.jsx
│   │       └── StatusBadge.jsx
│   ├── Dockerfile                   # Multi-stage (node:20-alpine → nginx:alpine)
│   ├── nginx.conf                   # SPA routing, /api proxy, security headers
│   └── package.json
│
├── monitoring/                      # Standalone observability stack (Legacy)
│   ├── docker-compose.yml           # Prometheus 2.51 + Grafana 10.4
│   ├── prometheus.yml               # CV API scraping config
│   └── grafana/                     # Dashboards + datasources provisioning
│
└── docker-compose.yaml              # Local dev: db + backend + frontend

devops-cv-app-infra/                 # [REPO B] Infra as Code + GitOps target
├── terraform/                       # GCP infrastructure
│   ├── main.tf                      # VPC, GKE cluster, Helm releases (ESO, ArgoCD)
│   ├── provider.tf                  # google ~5.0, kubernetes ~2.0, helm ~2.0
│   └── variable.tf
│
├── argocd-config/                   # ArgoCD Application CRDs
│   ├── root-app.yaml                # Syncs k8s/ recursively
│   ├── cert-manager-app.yaml         # cert-manager Helm chart
│   ├── dex-app.yaml                 # Dex Helm (GitHub OAuth)
│   ├── nginx-ingress-app.yaml        # ingress-nginx Helm (GCP NLB)
│   └── monitoring-app.yaml          # kube-prometheus-stack Helm
│
├── k8s/
│   ├── app/                         # Application workloads
│   │   ├── backend.yaml              # Deployment + Service :8000
│   │   ├── frontend.yaml            # Deployment + Service :80
│   │   ├── db.yaml                   # Deployment + Service + PVC :5432
│   │   └── pod-disruption-budgets.yaml
│   ├── network-policies/            # Network policies
│   ├── external-secrets/            # GCP Secret Manager sync (4 secrets)
│   ├── monitoring/                  # Loki, dashboards, ServiceMonitor
│   ├── ingress.yaml                 # Nginx Ingress + TLS routing
│   └── cert-issuer.yaml             # Let's Encrypt DNS-01 via Cloudflare
│
└── bootstrap-platform.yaml          # ArgoCD Application (applied once)
```

---

## Prerequisites

### Local Development

| Tool | Min. Version | Purpose |
|---|---|---|
| [Docker](https://docs.docker.com/get-docker/) | 24+ | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2+ | Multi-service orchestration |
| [Git](https://git-scm.com/) | 2.40+ | Source control |

### Backend-Only (without Docker)

| Tool | Min. Version | Purpose |
|---|---|---|
| [Python](https://www.python.org/downloads/) | 3.11+ | Runtime |
| [Node.js](https://nodejs.org/) | 20+ | Frontend build tools |
| [PostgreSQL](https://www.postgresql.org/download/) | 15+ | Database |

---

## Local Development

### Quick Start (Docker Compose)

```bash
# 1. Clone application repository
git clone https://github.com/Kavallerya/devops-cv-app.git
cd devops-cv-app

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# 3. Start all services (db → backend → frontend)
docker compose up -d

# 4. Verify everything is running
docker compose ps
```

### Access Points

| Service | Local URL | Description |
|---|---|---|
| **Frontend (Nginx)** | `http://localhost:80` | React SPA with Tailwind CSS |
| **Backend (Uvicorn)** | `http://localhost:8000` | FastAPI REST API |
| **API Docs (Swagger)** | `http://localhost:8000/docs` | Interactive OpenAPI documentation |
| **API Docs (ReDoc)** | `http://localhost:8000/redoc` | Alternative API documentation |
| **Prometheus Metrics** | `http://localhost:8000/api/metrics` | Raw Prometheus metrics |
| **Health Check** | `http://localhost:8000/health` | Liveness/readiness probe |
| **Database** | `localhost:${DB_PORT}` | PostgreSQL 15 |

### Service Dependency Graph

```
db (postgres:15-alpine)
  │  healthcheck: pg_isready
  │
  └──→ backend (FastAPI)
         │  healthcheck: curl /health
         │
         └──→ frontend (Nginx + React)
```

### Port Mapping (Host vs Docker Network)

| Service | Container Port | Host Port | Note |
|---|---|---|---|
| `db` | 5432 | `${DB_PORT}` (default `5432`) | Exposed for pgAdmin/DBeaver access |
| `backend` | 8000 | 8000 | API and Swagger UI |
| `frontend` | 80 | 80 | Nginx serving static SPA |

> **Docker network internals:** Inside the compose network, the `backend` container connects to `db:5432` (not localhost). The frontend Nginx proxies `/api` requests to `backend:8000`.

### Individual Services (Without Docker)

```bash
# === Backend ===
cd backend
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --port 8000

# === Frontend ===
cd frontend
npm install
npm run dev    # http://localhost:5173, proxies /api → localhost:8000
```

### Run Tests

```bash
cd backend
pip install ruff pytest

ruff check .                  # Linting
ruff format --check .         # Formatting
pytest test_main.py -v         # Integration tests
```

---

## Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

### Required Variables (Docker Compose)

| Variable | Purpose | Example Value |
|---|---|---|
| `DB_USER` | PostgreSQL user for application and Docker Compose | `admin` |
| `DB_PASSWORD` | PostgreSQL password for the user above | `changeme123` |
| `DB_NAME` | PostgreSQL database name | `cv_db` |
| `DB_PORT` | Host port mapping for PostgreSQL | `5432` |

### Optional Variables (Backend)

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | Full async connection string (used when running backend outside Compose) | `postgresql+asyncpg://postgres:password@localhost:5432/cv_db` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:5173,http://localhost:3000` |

> **Note:** When using `docker compose up`, the `DATABASE_URL` in the backend container is auto-generated from `DB_USER`, `DB_PASSWORD`, and `DB_NAM`. No need to set `DATABASE_URL` separately for Compose usage.

---

## API Endpoints

The backend serves a RESTful API with 11 endpoints. Full interactive documentation available at `/docs` (Swagger UI).

### Data Endpoints

| Method | Endpoint | Response | Description |
|---|---|---|---|
| `GET` | `/api/profile` | `ProfileResponse` | CV owner info (name, title, contact links) — also tracks unique visitors |
| `GET` | `/api/experience` | `ExperienceListResponse` | Work history ordered by `order` |
| `GET` | `/api/skills` | `SkillsListResponse` | Skills grouped by category (DevOps, Cloud, Languages, etc.) |
| `GET` | `/api/projects` | `List[ProjectResponse]` | Portfolio projects with tech stack, featured flag |
| `GET` | `/api/education` | `List[EducationResponse]` | Academic history |
| `GET` | `/api/certifications` | `List[CertificationResponse]` | Professional certifications (issuer, expiry, credentials) |
| `GET` | `/api/github/activity` | `Dict` | GitHub user stats + 6 most recently pushed repos |

### Contact Form

| Method | Endpoint | Body | Response | Description |
|---|---|---|---|
| `POST` | `/api/contact` | `ContactRequest` (name, email, subject, message) | `ContactResponse` (id, "Thank you" message) | Submit contact form |

### Operational Endpoints

| Method | Endpoint | Response | Description |
|---|---|---|
| `GET` | `/api/status` | `StatusResponse` (status, version, uptime_seconds, visitor_count) | System health + usage stats |
| `GET` | `/api/metrics` | `text/plain` (Prometheus exposition format) | Metrics for Prometheus scraping |
| `GET` | `/health` | `{"status": "ok"}` | Kubernetes liveness/readiness probe |

### Data Models

| Model | Table | Key Fields |
|---|---|---|
| `Profile` | `profile` | name, title, summary, email, phone, location, linkedin, github |
| `Experience` | `experience` | company, role, start_date, end_date, description, order |
| `Skill` | `skills` | category, name |
| `Education` | `education` | institution, degree, field, period, description, order |
| `Certification` | `certifications` | name, issuer, date, expiry_date, credential_url, badge_url, order |
| `Project` | `projects` | name, description, tech_stack (JSON), github_url, live_url, featured, order |
| `Visitor` | `visitors` | ip_hash (SHA-256), visited_at (timestamptz) |
| `ContactMessage` | `contact_messages` | name, email, subject, message, created_at |

### Visitor Privacy

Visitor IPs are **SHA-256 hashed** before storage — unique visit counting without storing plain-text IP addresses.
The `cv_visitors_total` Prometheus counter tracks total unique visits over the application's uptime.

---

## CI/CD Pipeline

Triggered on push to `main` (except monitoring/ changes):

```
GitHub Actions: deploy.yml
│
├── [JOB 1] quality-checks (Python 3.11)
│   ├── ruff check + format check
│   ├── mypy type check (non-blocking)
│   ├── pip-audit (dependency CVE scan)
│   └── pytest integration tests (with PostgreSQL service container)
│
├── [JOB 1b] frontend-check (Node 20)
│   ├── npm ci (clean install)
│   └── npm audit --audit-level=high (non-blocking)
│
├── [JOB 2] build-scan-push (Docker)
│   ├── Docker Buildx build
│   ├── Trivy vulnerability scan
│   │   ├── Backend: ✋ block on CRITICAL CVE (exit-code=1)
│   │   └── Frontend: ⚠ report CRITICAL + HIGH only (exit-code=0)
│   ├── Push to Docker Hub (both :{sha} and :latest tags)
│   └── Artifact: image_tag (git SHA short)
│
└── [JOB 3] update-infra-repo (GitOps)
    ├── Checkout devops-cv-ap-infra/main
    ├── sed replace image tags in k8s/app/*.yaml
    ├── git commit + push
    └── ArgoCD auto-syncs → rolling update
```

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` | Docker Hub authentication for push |
| `INFRA_REPO_TOKEN` | PAT with write access to `devops-cv-ap-infra` |
| `MONITORING_HOST` | Sndalone VM IP for monitoring deploy |
| `MONITORING_USER` / `MONITORING_SSH_KEY` / `MONITORING_PORT` | SSH credentials |
| `CV_API_HOST` | API endpoint for Prometheus scraping config |
| `GRAFANA_USER` / `GRAFANA_PASSWORD` | Grafana admin credentials |

---

## Infrastructure & GitOps

### Provisioning Flow

```
┌───────────────────────────────────────────────────────────────┐
│  [1] terraform apply  →  GCP resources                        │
│       ├── VPC + GKE Standard (2 nodes, e2-standard-4)         │
│       ├── Helm: External Secrets Operator                     │
│       └── Helm: ArgoCD                                        │
├───────────────────────────────────────────────────────────────┤
│  [2] kubectl apply bootstrap-platform.yaml                     │
│       └── ArgoCD Application → syncs argocd-config/           │
│           ├── cert-manager (v1.14.0)                          │
│           ├── Dex (v0.19.1) ← GitHub OAuth connector           │
│           ├── ingress-nginx (v4.10.1) ← GCP TCP NLB           │
│           ├── kube-prometheus-stack (v58.2.2)                  │
│           └── root-application → syncs k8s/ recursively        │
│               ├── Namespaces (dex, monitoring, ingress-nginx) │
│               ├── External Secrets (4 syncs from GCP SM)      │
│               ├── App workloads (backend, frontend, db)        │
│               ├── Ingress + TLS (Let's Encrypt)               │
│               ├── Network Policies + PDBs                     │
│               └── Monitoring (Loki, dashboards, ServiceMon)    │
└───────────────────────────────────────────────────────────────┘
```

### Workload Specifications (GKE)

| Component | Replicas | CPU Rquest/Limit | Memory Rquest/Limit | Strategy |
|---|---|---|---|---|
| `backend` | 1 | 50m / 500m | 64Mi / 512Mi | RollingUpdate |
| `frontend` | 1 | 20m / 200m | 32Mi / 256Mi | RollingUpdate |
| `postgres` | 1 | 50m / 500m | 128Mi / 512Mi | Recreate |

### Secret Management

Zero secrets in Git repositories. All sensitive data flows through GCP Secret Manager → External Secrets Operator:

```
GCP Secret Manager                    K8s Namespace       K8s Secret
  ├── cv-db-password  ───────→   default           db-secret
  ├── cloudflare-api-token ────→   cert-manager        cloudflare-api-token-secret
  └── dex-github-creds ────→   dex                 dex-env-secrets
                                   └→ monitoring         grafana-dex-client-secret
```

### ArgoCD Sync Policy

- **selfHeal:** `true` — drift detected → auto-correct
- **prune:** `true` — resources removed from cluster when removed from Git
- **CreateNamespace:** `true` — auto-create namespaces
- **Sync wave ordering:** ensures Ingress created after workloads are ready

---

## Observability

### In-Cluster (Primary)

| Component | Deployment | Purpose |
|---|---|---|
| **Prometheus** | kube-prometheus-stack | Metrics TSDB, ServiceMonitor auto-discovery |
| **Grafana** | kube-prometheus-stack | Dashboards, OIDC auth via Dex (GitHub org-restricted) |
| **Loki** | loki-stack (2.10.2) | Log aggregation (Promtail DaemonSet) |
| **Alertmanager** | kube-prometheus-stack | Deployed (built-in alerts only) |

### Metrics Collected

| Metric | Type | Labels |
|---|---|---|
| `http_requests_total` | Counter | handler, method, status |
| `http_request_duration_seconds` | Histogram | handler, method, le |
| `http_requests_inprogress` | Gauge | handler, method |
| `cv_visitors_total` | Counter | — |

### Grafana Dashboard (7 Panels)

| # | Panel | Data Source | Query Description |
|---|---|---|---|
| 1 | Total API Requests | Prometheus | `sum(increase(http_requests_total[$__range]))` |
| 2 | Unique Visitors | Prometheus | `cv_visitors_total` |
| 3 | Request Rate by Endpoint | Prometheus | `sum by (handler, method) (rate(http_requests_total[$__rate_interval]))` |
| 4 | P95 Request Latency | Prometheus | `histogram_quantile(0.95, sum by (le, handler) (rate(http_request_duration_seconds_bucket[$__rate_interval])))` |
| 5 | Error Rate (5xx) | Prometheus | `sum(rate(http_requests_total{status=~"5.."}[$__rate_interval])) / sum(rate(http_requests_total[$__rate_interval]))` |
| 6 | Requests by Status Code | Prometheus | `sum by (status) (rate(http_requests_total[$__rate_interval]))` |
| 7 | Backend Logs | Loki | `{namespace="default"}` label filter |

### Authentication Flow (Grafana OIDC)

```
User → https://monitor.imorozov.xyz
  → Grafana redirects to Dex (https://auth.imorozov.xyz/auth)
  → Dex → GitHub OAuth
  → User authenticates with GitHub
  → Dex maps roles:
      ├── org: imorozov-infra, team: devops → Grafana Admin
      └── other authenticated users → Viewer
```

### Standalone (External VM)

A legacy `monitoring/` stack (Prometheus 2.51 + Grafana 10.4 via Docker Compose) runs on an external VM as an independent health check, scraping the production API from outside the cluster. Deployed by `monitoring-deploy.yml` workflow.

---

## Security

| Layer | Implementation |
|---|---|
| **Secrets Management** | GCP Secret Manager → External Secrets Operator, zero secrets in Git |
| **Workload Identity** | GKE nodes authenticate to GCP without static service account keys |
| **TLS**| Let's Encrypt production certificates, auto-renewed by cert-manager (DNS-01 via Cloudflare) |
| **Container Security** | Non-root users in Dockerfiles, `.dockerignore`, Trivy vulnerability scanning (CRITICAL blocks deploy) |
| **Network Policies** | Backend: ingress from frontend/ingress-nginx/monitoring, egress to db:5432 + DNS/HTTPS. DB: ingress only from backend |
| **Authentication** | Grafana OIDC via Dex → GitHub, restricted to `imorozov-infra` org / `devops` team |
| **Privacy** | Visitor IPs SHA-256 hashed, no plain-text IP stored |
| **Security Headers** | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin` |
| **API Protection** | Nginx blocks `/api/metrics` from public access (403), dotfiles denied |
| **Pod Disruption Budgets** | Backend and frontend protected against voluntary disruptions |

---


**Built with FastAPI + React + Kubernetes — GitOps via ArgoCD**