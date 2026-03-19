from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Experience
from app.schemas import ExperienceListResponse, ExperienceResponse

router = APIRouter()


@router.get("/experience", response_model=ExperienceListResponse)
async def get_experience(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Experience).order_by(Experience.order.asc()))
    items = result.scalars().all()
    return ExperienceListResponse(
        items=[ExperienceResponse.model_validate(e) for e in items],
        total=len(items),
    )
