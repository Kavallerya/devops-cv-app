# Project Name - Legacy v1

> [!WARNING]
> **Legacy Architecture Branch (`v1-docker-compose`)**
> 
> This branch contains the initial, legacy version of our application. It uses a monolithic Docker Compose setup, manual provisioning (ClickOps), and push-based deployments via GitHub Actions.
> 
> **For the modern, Enterprise-grade GitOps & Kubernetes version, please refer to the `main` branch.**

## Project Overview & Tech Stack

A full-stack resume application serving your CV as a REST API, with a React frontend and Prometheus metrics ready for Grafana dashboarding. The application is composed of a responsive frontend, a robust backend API, and a relational database, fully containerized to ensure consistent behavior across different environments.

**Technologies Used:**
- **Backend:** Python 3.11+ · FastAPI · SQLAlchemy (async) · PostgreSQL
- **Frontend:** React 18 · Vite · Node.js (served via Nginx)
- **Monitoring:** Prometheus · Grafana
- **Containerization:** Docker · Docker Compose
- **CI/CD & Hosting:** GitHub Actions · AWS EC2

---

## v1 Architecture (Push-based)

The infrastructure in this `v1-docker-compose` branch represents our initial working MVP:
- **Hosting:** The application is hosted on an AWS EC2 instance.
- **Orchestration:** We use Docker Compose (`docker-compose.prod.yml`) to manage the lifecycle of our containers (Frontend, Backend, Database, and Monitoring) on a single node.
- **CI/CD Pipeline:** We use GitHub Actions for continuous integration and deployment. The pipeline builds the Docker images, pushes them to Docker Hub, and then connects to the EC2 server via SSH. It pulls the latest images and runs `docker compose up -d` to deploy. This is a classic **push-based** deployment model.

---

## The Evolution: Why We Moved to Kubernetes

While the v1 architecture served us well as an MVP, it presented several limitations that hindered scalability, security, and maintainability. The transition to the `main` branch demonstrates maturity and adherence to modern Cloud-Native and FinOps best practices.

Here is why this architecture was deprecated:

*   **ClickOps vs. IaC:** 
    *   *v1 (Legacy):* The AWS EC2 infrastructure and networking were manually provisioned via the AWS Console ("ClickOps"). This approach is error-prone, hard to reproduce, and difficult to audit.
    *   *v2 (Modern):* Uses Terraform for declarative Infrastructure as Code (IaC), ensuring our infrastructure is version-controlled, automated, and repeatable.
*   **Push vs. Pull (GitOps):** 
    *   *v1 (Legacy):* Uses a push-based CI/CD approach. GitHub Actions holds SSH keys and directly executes commands on the production server. This introduces a significant security risk and couples the CI system tightly with the production environment.
    *   *v2 (Modern):* Implements a secure, pull-based GitOps approach using ArgoCD. The cluster pulls its desired state directly from Git, removing the need to expose production credentials to the CI pipeline.
*   **Docker Compose vs. Kubernetes:** 
    *   *v1 (Legacy):* Docker Compose on a single EC2 instance creates a single point of failure. Scaling requires manual intervention and results in downtime during deployments.
    *   *v2 (Modern):* Uses Google Kubernetes Engine (GKE) for high availability. It provides self-healing, automated horizontal scaling, and zero-downtime rolling updates, ensuring enterprise-grade reliability.

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

To test this legacy setup on your local machine, you have two options: running with Docker Compose or running components independently.

### Option A: Run with Docker Compose (Recommended)

1.  **Clone this specific branch:**
    ```bash
    git clone -b v1-docker-compose https://github.com/your-username/devops-cv-app.git
    cd devops-cv-app
    ```

2.  **Set up the environment variables:**
    Copy the example environment file and fill in your desired values.
    ```bash
    cp .env.example .env
    ```
    Ensure the following variables are set in your `.env` file:
    ```env
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=cv_db
    DB_PORT=5432
    ```

3.  **Start the application:**
    Run Docker Compose to build and start the services.
    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**
    - Frontend: `http://localhost:80`
    - Backend API: `http://localhost:8000`
    - API Documentation (Swagger): `http://localhost:8000/docs`

5.  **Tear down:**
    To stop and remove the containers, networks, and volumes (optional):
    ```bash
    docker-compose down -v
    ```

### Option B: Run Without Docker (Local Dev)

#### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (local or remote)

#### 1. Database Setup

Create the database:
```sql
CREATE DATABASE cv_db;
```

#### 2. Backend

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

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`. The Vite dev proxy forwards `/api/*` requests to the backend automatically.

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

Once Prometheus is scraping, use PromQL queries in Grafana to monitor requests, rate, and latency.

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

```text
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

### Required GitHub Secrets

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

Please note that the workflow file specifies the **"cv-devops-env"** secret environment.

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
