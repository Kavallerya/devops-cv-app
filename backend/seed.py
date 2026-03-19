import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models import Base, Profile, Experience, Skill


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

        await session.commit()

    await engine.dispose()
    print("[seed] Done.")


if __name__ == "__main__":
    asyncio.run(seed())
