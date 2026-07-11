# Dynamic CV Platform — GitOps-Driven Full-Stack Portfolio

A production-grade CV/portfolio platform deployed on **GCP GKE** with **ArgoCD GitOps**, showcasing a FastAPI backend, React/Vite frontend, PostgreSQL, and a full observability stack (Prometheus, Loki, Grafana).

**Stack:** Python 3.11 · FastAPI · SQLAlchemy (async) · PostgreSQL 15 · React 18 · Vite 6 · Tailwind CSS 4 · prometheus-client

---

## Architecture

```
                         Internet
                            │
                    ┌───────▼────────┐
                    │  Cloudflare DNS │  imorozov.xyz
                    └───────┬────────┘
                            │ TLS (Let's Encrypt)
                    ┌───────▼────────┐
                    │   GCP GKE      │  europe-central2
                    │ ┌────────────┐ │
                    │ │ Nginx      │ │  ingress-nginx
                    │ │ Ingress    │ │
                    │ └─┬───────┬──┘ │
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
                    │      Grafana       │  Dex OIDC (GitHub)
                    │      Loki          │
                    └─────────────────────┘
```

| Domain | Target | Auth |
|---|---|---|
| `imorozov.xyz` | React SPA (Nginx) | Public |
| `api.imorozov.xyz` | FastAPI REST API | Public |
| `auth.imorozov.xyz` | Dex OIDC Provider | Public (OAuth) |
| `monitor.imorozov.xyz` | Grafana Dashboard | Dex → GitHub (org-restricted) |

---

## Project Structure

### Repositories

| Repo | Purpose |
|---|---|
| `devops-cv-app` | Application source, Dockerfiles, CI/CD workflows |
| `devops-cv-app-infra` | Terraform (GCP), ArgoCD configs, Kubernetes manifests |

### Key Directories

```
devops-cv-app/
├── backend/               # FastAPI backend service
│   ├── app/routers/       # API endpoints (profile, experience, skills, etc.)
│   ├── app/models.py      # SQLAlchemy ORM (8 models)
│   ├── app/metrics.py     # Prometheus counters + histogram
│   ├── seed.py            # Idempotent DB seeder
│   └── Dockerfile         # Multi-stage (python:3.11-slim)
├── frontend/              # React/Vite SPA
│   ├── src/components/    # UI components (12 sections)
│   ├── nginx.conf         # SPA routing + /api proxy + security headers
│   └── Dockerfile         # Multi-stage (node:20-alpine → nginx:alpine)
├── monitoring/            # Standalone Prometheus + Grafana (Legacy)
└── .github/workflows/
    ├── deploy.yml         # CI/CD: lint → test → build → scan → GitOps
    └── monitoring-deploy.yml

devops-cv-app-infra/
├── terraform/             # GCP: VPC, GKE, External Secrets, ArgoCD
├── argocd-config/         # ArgoCD Application CRDs (5 apps)
└── k8s/
    ├── app/               # Deployments: backend, frontend, db
    ├── external-secrets/  # GCP Secret Manager → K8s Secrets
    ├── monitoring/        # Loki, Grafana dashboard, ServiceMonitor
    ├── ingress.yaml       # Nginx Ingress + TLS routing
    └── cert-issuer.yaml   # Let's Encrypt DNS-01 via Cloudflare
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | CV owner profile |
| GET | `/api/experience` | Work history (ordered) |
| GET | `/api/skills` | Skills grouped by category |
| GET | `/api/projects` | Portfolio projects |
| GET | `/api/certifications` | Professional certifications |
| GET | `/api/education` | Education history |
| GET | `/api/github/activity` | GitHub stats + recent repos |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/status` | System status + uptime + visitors |
| GET | `/api/metrics` | Prometheus metrics endpoint |
| GET | `/health` | Liveness/readiness check |

---

## GitOps Delivery Pipeline

```
Developer push to devops-cv-app/main
    │
    ▼
[GitHub Actions: deploy.yml]
  ├── quality-checks: Ruff + Pytest + Alembic
  ├── build-scan-push: Docker build → Trivy scan → push to Docker Hub
  └── update-infra-repo: sed image tags → push to devops-cv-app-infra/main
        │
        ▼
[ArgoCD detects drift]
  ├── selfHeal: true, prune: true
  ├── backend: Rolling Update
  └── frontend: Rolling Update
```

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `INFRA_REPO_TOKEN` | PAT for `devops-cv-app-infra` write access |
| `MONITORING_HOST` | Standalone monitoring VM IP |
| `MONITORING_USER` | SSH user |
| `MONITORING_SSH_KEY` | SSH private key |
| `MONITORING_PORT` | SSH port (default 22) |
| `CV_API_HOST` | API host for Prometheus scraping |
| `GRAFANA_USER` / `GRAFANA_PASSWORD` | Grafana admin credentials |

---

## Observability

### Metrics (Prometheus)

| Metric | Type | Labels |
|---|---|---|
| `http_requests_total` | Counter | handler, method, status |
| `http_request_duration_seconds` | Histogram | handler, method, le |
| `http_requests_inprogress` | Gauge | handler, method |
| `cv_visitors_total` | Counter | — |

### Grafana Dashboard (7 Panels)

| Panel | Query |
|---|---|
| Total API Requests | `sum(increase(http_requests_total[$__range]))` |
| Unique Visitors | `cv_visitors_total` |
| Request Rate by Endpoint | `sum by (handler, method) (rate(http_requests_total[$__rate_interval]))` |
| P95 Request Latency | `histogram_quantile(0.95, sum by (le, handler) (rate(http_request_duration_seconds_bucket[$__rate_interval])))` |
| Error Rate (5xx) | `sum(rate(http_requests_total{status=~"5.."}[$__rate_interval])) / sum(rate(http_requests_total[$__rate_interval])) or vector(0)` |
| Requests by Status Code | `sum by (status) (rate(http_requests_total[$__rate_interval]))` |
| Backend Logs | Loki — `{namespace="default"}` |

### Authentication

Grafana access is restricted via **Dex OIDC** with **GitHub OAuth**:
- Org: `imorozov-infra`
- Team: `devops` → Grafana Admin role
- Other users → Viewer role

---

## Local Development

### Prerequisites
- Python 3.11+, Node.js 20+, Docker Compose

### Quick Start
```bash
# 1. Configure environment
cp .env.example .env

# 2. Start all services
docker compose up -d

# 3. Access
# Frontend:  http://localhost
# Backend:   http://localhost:8000/api/docs
# Metrics:   http://localhost:8000/api/metrics
```

### Backend Only
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173, proxies /api → backend:8000
```

### Run Tests
```bash
cd backend
pip install ruff pytest
ruff check .
pytest test_main.py -v
```

---

## Infrastructure Provisioning

### Initial Setup (one-time)
```bash
# 1. Provision GCP resources
cd devops-cv-app-infra/terraform
terraform init
terraform apply

# 2. Bootstrap ArgoCD
kubectl apply -f bootstrap-platform.yaml
```

ArgoCD will then sync all infrastructure components (cert-manager, Dex, ingress-nginx, Prometheus stack) and application workloads automatically.

### Deploy Application Update
Just push to `main` in `devops-cv-app`. CI handles the rest — ArgoCD detects the new image tags and performs a rolling update.

---

## Security

- **Secrets:** GCP Secret Manager → External Secrets Operator → K8s Secrets. Zero secrets in Git.
- **Workload Identity:** GKE nodes authenticate to GCP without service account keys.
- **Container Security:** Non-root users, `.dockerignore`, Trivy vulnerability scanning.
- **TLS:** Let's Encrypt production certificates, auto-renewed by cert-manager.
- **Auth:** Grafana OIDC via Dex, GitHub org/team restricted.
- **Privacy:** Visitor IPs SHA-256 hashed before storage.
- **Headers:** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin`.

---

## Tech Debt & Roadmap

See `.workspace/roadmap.md` for prioritized improvements.
