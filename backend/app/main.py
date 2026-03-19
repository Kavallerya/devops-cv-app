from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import Base
from app.metrics import PrometheusMiddleware
from app.routers import profile, experience, skills, metrics


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

app.add_middleware(PrometheusMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_origins(),
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(experience.router, prefix="/api", tags=["experience"])
app.include_router(skills.router, prefix="/api", tags=["skills"])
app.include_router(metrics.router, prefix="/api", tags=["metrics"])


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
