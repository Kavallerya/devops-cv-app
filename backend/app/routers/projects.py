from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Project
from app.schemas import ProjectResponse

router = APIRouter()


@router.get("/projects", response_model=list[ProjectResponse])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project).order_by(Project.order.asc())
    )
    return result.scalars().all()
