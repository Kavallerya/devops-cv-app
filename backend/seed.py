import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models import Base, Profile, Experience, Skill, Certification, Project


PROFILE_DATA = {
    "name": "Illia Morozov",
    "title": "DevOps / Platform Engineer",
    "summary": (
        "DevOps engineer building and maintaining cloud-native "
        "infrastructure. Passionate about CI/CD automation, observability, and developer experience. "
        "Open source contributor and infrastructure-as-code advocate."
    ),
    "email": "illia.morozov@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "Remote — Warsaw, Poland",
    "linkedin": "https://linkedin.com/in/illia-morozov",
    "github": "https://github.com/illia-morozov",
}

EXPERIENCE_DATA = [
    {
        "company": "CloudScale Inc.",
        "role": "Senior DevOps Engineer",
        "start_date": "2022-01",
        "end_date": None,
        "description": (
            "Leading the migration of a monolithic application to a microservices architecture on Kubernetes. "
            "Designed and implemented CI/CD pipelines using GitHub Actions and ArgoCD. "
            "Reduced deployment time by 70% and improved system uptime to 99.95%."
        ),
        "order": 1,
    },
    {
        "company": "DataStream Ltd.",
        "role": "DevOps Engineer",
        "start_date": "2020-03",
        "end_date": "2021-12",
        "description": (
            "Built and maintained infrastructure on AWS using Terraform and Ansible. "
            "Implemented centralized logging with ELK Stack and monitoring with Prometheus and Grafana. "
            "Automated infrastructure provisioning reducing manual effort by 80%."
        ),
        "order": 2,
    },
    {
        "company": "WebApps Studio",
        "role": "Junior Systems Administrator",
        "start_date": "2018-06",
        "end_date": "2020-02",
        "description": (
            "Managed on-premise Linux servers and administered databases (PostgreSQL, MySQL). "
            "Introduced basic CI/CD with Jenkins and Docker, cutting release cycles from weekly to daily. "
            "Wrote internal documentation and runbooks for the operations team."
        ),
        "order": 3,
    },
]

SKILLS_DATA = [
    {"category": "Cloud & Infrastructure", "name": "AWS (EC2, S3, RDS, EKS)", "level": "expert"},
    {"category": "Cloud & Infrastructure", "name": "Terraform", "level": "expert"},
    {"category": "Cloud & Infrastructure", "name": "Ansible", "level": "intermediate"},
    {"category": "Containers & Orchestration", "name": "Docker", "level": "expert"},
    {"category": "Containers & Orchestration", "name": "Kubernetes", "level": "expert"},
    {"category": "Containers & Orchestration", "name": "Helm", "level": "intermediate"},
    {"category": "CI/CD", "name": "GitHub Actions", "level": "expert"},
    {"category": "CI/CD", "name": "ArgoCD", "level": "intermediate"},
    {"category": "CI/CD", "name": "Jenkins", "level": "intermediate"},
    {"category": "Observability", "name": "Prometheus", "level": "expert"},
    {"category": "Observability", "name": "Grafana", "level": "expert"},
    {"category": "Observability", "name": "ELK Stack", "level": "intermediate"},
    {"category": "Programming", "name": "Python", "level": "expert"},
    {"category": "Programming", "name": "Bash / Shell scripting", "level": "expert"},
    {"category": "Programming", "name": "Go", "level": "beginner"},
    {"category": "Databases", "name": "PostgreSQL", "level": "intermediate"},
    {"category": "Databases", "name": "Redis", "level": "intermediate"},
    {"category": "Databases", "name": "MongoDB", "level": "beginner"},
]

CERTIFICATIONS_DATA = [
    {
        "name": "Certified Kubernetes Administrator (CKA)",
        "issuer": "CNCF / The Linux Foundation",
        "date": "2024-03",
        "expiry_date": "2027-03",
        "credential_url": "https://www.credly.com/example-cka",
        "badge_url": "https://images.credly.com/cka-badge.png",
        "order": 1,
    },
    {
        "name": "AWS Solutions Architect — Associate",
        "issuer": "Amazon Web Services",
        "date": "2023-11",
        "expiry_date": "2026-11",
        "credential_url": "https://www.credly.com/example-aws-saa",
        "badge_url": "https://images.credly.com/aws-saa-badge.png",
        "order": 2,
    },
    {
        "name": "HashiCorp Certified: Terraform Associate",
        "issuer": "HashiCorp",
        "date": "2023-06",
        "expiry_date": "2025-06",
        "credential_url": "https://www.credly.com/example-tf",
        "badge_url": "https://images.credly.com/tf-badge.png",
        "order": 3,
    },
    {
        "name": "Certified Kubernetes Security Specialist (CKS)",
        "issuer": "CNCF / The Linux Foundation",
        "date": "2025-01",
        "expiry_date": "2028-01",
        "credential_url": "https://www.credly.com/example-cks",
        "badge_url": "https://images.credly.com/cks-badge.png",
        "order": 4,
    },
]

PROJECTS_DATA = [
    {
        "name": "DevOps CV Platform",
        "description": (
            "Full-stack CI/CD portfolio platform built with FastAPI, React, PostgreSQL, "
            "deployed on GKE with ArgoCD GitOps. Features automated Trivy scanning, "
            "Prometheus/Grafana observability, and Dex OIDC authentication."
        ),
        "tech_stack": {
            "Backend": "Python / FastAPI",
            "Frontend": "React / Vite / Tailwind",
            "Infra": "GCP / GKE / Terraform",
            "CI/CD": "GitHub Actions / ArgoCD",
            "Monitoring": "Prometheus / Grafana / Loki",
        },
        "github_url": "https://github.com/Kavallerya/devops-cv-app",
        "live_url": "https://imorozov.xyz",
        "featured": True,
        "order": 1,
    },
    {
        "name": "Infrastructure as Code Toolkit",
        "description": (
            "Collection of reusable Terraform modules for GCP and AWS. Includes configurations "
            "for GKE clusters, VPC networking, IAM with Workload Identity, "
            "and managed database provisioning."
        ),
        "tech_stack": {
            "IaC": "Terraform / Terragrunt",
            "Cloud": "GCP / AWS",
            "Secrets": "Vault / GCP Secret Manager",
        },
        "github_url": "https://github.com/Kavallerya/devops-cv-app-infra",
        "live_url": None,
        "featured": True,
        "order": 2,
    },
    {
        "name": "Observability Stack",
        "description": (
            "Self-hosted monitoring stack with Prometheus for metrics, Loki for logs, "
            "and Grafana for dashboards. Deployed via Docker Compose and Kubernetes Helm charts."
        ),
        "tech_stack": {
            "Metrics": "Prometheus",
            "Logs": "Loki / Promtail",
            "Dashboards": "Grafana",
        },
        "github_url": "https://github.com/Kavallerya/devops-cv-app",
        "live_url": "https://monitor.imorozov.xyz",
        "featured": False,
        "order": 3,
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

        existing_certs = await session.execute(select(Certification).limit(1))
        if existing_certs.scalar_one_or_none() is None:
            for cert in CERTIFICATIONS_DATA:
                session.add(Certification(**cert))
            print(f"[seed] Inserted {len(CERTIFICATIONS_DATA)} certifications.")
        else:
            print("[seed] Certifications already exist, skipping.")

        existing_projects = await session.execute(select(Project).limit(1))
        if existing_projects.scalar_one_or_none() is None:
            for proj in PROJECTS_DATA:
                session.add(Project(**proj))
            print(f"[seed] Inserted {len(PROJECTS_DATA)} projects.")
        else:
            print("[seed] Projects already exist, skipping.")

        await session.commit()

    await engine.dispose()
    print("[seed] Done.")


if __name__ == "__main__":
    asyncio.run(seed())
