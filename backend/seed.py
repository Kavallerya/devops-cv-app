import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models import Base, Profile, Experience, Skill, Project, Education


PROFILE_DATA = {
    "name": "Illya",
    "title": "Junior DevOps Engineer | Cloud & GitOps Enthusiast",
    "summary": (
        "I am a results-driven Junior DevOps Engineer with a strong focus on "
        "Infrastructure as Code (IaC), GitOps automation, and system observability. "
        "Combining a solid academic foundation in Informatics at Collegium Da Vinci "
        "with hands-on experience in cloud-native environments, I specialize in "
        "containerizing microservices, managing Kubernetes clusters, and building "
        "secure, automated release pipelines. I am passionate about eliminating "
        "manual toil and ensuring high availability across multi-cloud architectures."
    ),
    "email": "contact@imorozov.xyz",
    "phone": "+48 123 456 789",
    "location": "Remote \u2014 Pozna\u0144, Poland",
    "linkedin": "https://linkedin.com/in/illya-morozov",
    "github": "https://github.com/Kavallerya",
}

EXPERIENCE_DATA = [
    {
        "company": "Self-Hosted / Personal Infrastructure",
        "role": "DevOps Engineer (Pet Projects)",
        "start_date": "2025-01",
        "end_date": None,
        "description": (
            "Built and deployed a full-stack Dynamic CV platform on GCP GKE with GitOps-driven CI/CD. "
            "Automated infrastructure provisioning with Terraform, implemented container vulnerability "
            "scanning with Trivy, and set up comprehensive observability with Prometheus, Loki, and "
            "Grafana. Configured Dex OIDC authentication with GitHub for secure dashboard access."
        ),
        "order": 1,
    },
    {
        "company": "Freelance / Volunteer Projects",
        "role": "Linux Server Administrator",
        "start_date": "2023-06",
        "end_date": "2024-12",
        "description": (
            "Administered and optimized remote Linux environments (Ubuntu/Debian) for high-load "
            "multiplayer game servers. Developed Bash scripts to automate server provisioning, "
            "routine restarts, and dynamic configuration updates. Configured Cloudflare DNS and "
            "analyzed OS-level network routing to mitigate latency and ensure high availability."
        ),
        "order": 2,
    },
]

SKILLS_DATA = [
    {"category": "Orchestration & Containerization", "name": "Kubernetes (K8s)"},
    {"category": "Orchestration & Containerization", "name": "Docker"},
    {"category": "Orchestration & Containerization", "name": "Docker Compose"},
    {"category": "Orchestration & Containerization", "name": "Helm"},
    {"category": "CI/CD & GitOps", "name": "GitHub Actions"},
    {"category": "CI/CD & GitOps", "name": "GitLab CI/CD"},
    {"category": "CI/CD & GitOps", "name": "ArgoCD"},
    {"category": "Infrastructure & Cloud", "name": "Terraform"},
    {"category": "Infrastructure & Cloud", "name": "GCP (GKE, Compute Engine)"},
    {"category": "Infrastructure & Cloud", "name": "AWS (EC2, IAM, VPC)"},
    {"category": "Infrastructure & Cloud", "name": "Cloudflare (DNS, WAF, Tunnels)"},
    {"category": "Observability", "name": "Prometheus"},
    {"category": "Observability", "name": "Grafana"},
    {"category": "Observability", "name": "Loki"},
    {"category": "Observability", "name": "ELK / EFK Stack"},
    {"category": "DevSecOps & Code Quality", "name": "Trivy"},
    {"category": "DevSecOps & Code Quality", "name": "Ruff / Flake8 / Black"},
    {"category": "DevSecOps & Code Quality", "name": "mypy"},
    {"category": "OS & Scripting", "name": "Linux (Ubuntu, Debian, CentOS/RHEL)"},
    {"category": "OS & Scripting", "name": "Bash / Shell Scripting"},
    {"category": "OS & Scripting", "name": "Python"},
    {"category": "Version Control", "name": "Git / GitHub / GitLab"},
    {"category": "Databases", "name": "PostgreSQL"},
    {"category": "Databases", "name": "MySQL"},
    {"category": "Databases", "name": "Redis"},
    {"category": "Databases", "name": "MongoDB"},
]

CERTIFICATIONS_DATA = []

PROJECTS_DATA = [
    {
        "name": "Dynamic CV Infrastructure & API (Self-Hosted Portfolio)",
        "description": (
            "End-to-End GitOps Deployment & Microservices Architecture. "
            "Designed a microservices-based portfolio using a Python FastAPI backend and a "
            "React/Vite frontend, fully containerized via Docker. Built robust GitHub Actions "
            "and GitLab CI/CD workflows for automated testing, code linting (Ruff, Flake8, "
            "Black, mypy), and container vulnerability scanning (Trivy) prior to registry pushes. "
            "Managed Kubernetes manifests using Helm and implemented automated, zero-downtime "
            "Rolling Updates to a GCP GKE cluster via ArgoCD. Provisioned a comprehensive "
            "monitoring stack (Prometheus, Loki, Grafana) to visualize logs, track API traffic, "
            "and alert on system anomalies."
        ),
        "tech_stack": {
            "Backend": "Python / FastAPI",
            "Frontend": "React / Vite / Tailwind",
            "Infra": "GCP GKE / Terraform",
            "CI/CD": "GitHub Actions / ArgoCD / Trivy",
            "Monitoring": "Prometheus / Grafana / Loki",
            "Auth": "Dex OIDC / GitHub",
        },
        "github_url": "https://github.com/Kavallerya/devops-cv-app",
        "live_url": "https://imorozov.xyz",
        "featured": True,
        "order": 1,
    },
    {
        "name": "Linux Server Administration & Network Optimization",
        "description": (
            "High-Load Dedicated Server Management. "
            "Administered and optimized remote Linux environments (Ubuntu/Debian) for high-load "
            "multiplayer game servers. Developed Bash scripts to automate server provisioning, "
            "routine restarts, and dynamic configuration updates. Configured Cloudflare DNS and "
            "analyzed OS-level network routing to mitigate latency and ensure high availability "
            "under peak loads."
        ),
        "tech_stack": {
            "OS": "Ubuntu / Debian",
            "Scripting": "Bash / Shell",
            "Networking": "Cloudflare DNS / WAF / Tunnels",
            "Tools": "systemd / iptables / nginx",
        },
        "github_url": None,
        "live_url": None,
        "featured": False,
        "order": 2,
    },
]

EDUCATION_DATA = [
    {
        "institution": "Collegium Da Vinci",
        "degree": "Bachelor",
        "field": "Informatics",
        "period": "Pozna\u0144, Poland",
        "description": (
            "Focus: Cloud Infrastructure, Systems Engineering, and Software Development. "
            "Combines theoretical foundations with practical hands-on projects in distributed "
            "systems and automation."
        ),
        "order": 1,
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        existing_profile = await session.execute(select(Profile).limit(1))
        if existing_profile.scalar_one_or_none() is None:
            session.add(Profile(**PROFILE_DATA))
            print("[seed] Inserted profile.")
        else:
            print("[seed] Profile already exists, skipping.")

        existing_exp = await session.execute(select(Experience).limit(1))
        if existing_exp.scalar_one_or_none() is None:
            for exp in EXPERIENCE_DATA:
                session.add(Experience(**exp))
            print(f"[seed] Inserted {len(EXPERIENCE_DATA)} experience entries.")
        else:
            print("[seed] Experience entries already exist, skipping.")

        existing_skills = await session.execute(select(Skill).limit(1))
        if existing_skills.scalar_one_or_none() is None:
            for skill in SKILLS_DATA:
                session.add(Skill(**skill))
            print(f"[seed] Inserted {len(SKILLS_DATA)} skills.")
        else:
            print("[seed] Skills already exist, skipping.")

        existing_projects = await session.execute(select(Project).limit(1))
        if existing_projects.scalar_one_or_none() is None:
            for proj in PROJECTS_DATA:
                session.add(Project(**proj))
            print(f"[seed] Inserted {len(PROJECTS_DATA)} projects.")
        else:
            print("[seed] Projects already exist, skipping.")

        existing_edu = await session.execute(select(Education).limit(1))
        if existing_edu.scalar_one_or_none() is None:
            for edu in EDUCATION_DATA:
                session.add(Education(**edu))
            print(f"[seed] Inserted {len(EDUCATION_DATA)} education entries.")
        else:
            print("[seed] Education already exist, skipping.")

        await session.commit()

    await engine.dispose()
    print("[seed] Done.")


if __name__ == "__main__":
    asyncio.run(seed())
