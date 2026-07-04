from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Education
from app.schemas import EducationResponse

router = APIRouter()


@router.get("/education", response_model=list[EducationResponse])
async def get_education(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Education).order_by(Education.order.asc())
    )
    return result.scalars().all()
