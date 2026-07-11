from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.database import engine
from app.models import Base
from app.routers import (
    certifications,
    contact,
    education,
    experience,
    github,
    profile,
    projects,
    skills,
    status,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Dynamic CV API",
    version="1.0.0",
    description="Resume served as a REST API with Prometheus metrics support.",
    lifespan=lifespan,
)

Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_instrument_requests_inprogress=True,
    excluded_handlers=["/health", "/api/metrics"],
    inprogress_name="http_requests_inprogress",
    inprogress_labels=True,
).instrument(app).expose(app, endpoint="/api/metrics")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(experience.router, prefix="/api", tags=["experience"])
app.include_router(skills.router, prefix="/api", tags=["skills"])
app.include_router(status.router, prefix="/api", tags=["status"])
app.include_router(certifications.router, prefix="/api", tags=["certifications"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(github.router, prefix="/api", tags=["github"])
app.include_router(contact.router, prefix="/api", tags=["contact"])
app.include_router(education.router, prefix="/api", tags=["education"])


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
