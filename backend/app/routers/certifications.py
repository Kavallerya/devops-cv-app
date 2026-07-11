from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Certification
from app.schemas import CertificationResponse

router = APIRouter()


@router.get("/certifications", response_model=list[CertificationResponse])
async def get_certifications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Certification).order_by(Certification.order.asc()))
    return result.scalars().all()
