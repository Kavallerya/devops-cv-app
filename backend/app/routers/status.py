import time
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Visitor
from app.schemas import StatusResponse

router = APIRouter()

START_TIME = time.time()


@router.get("/status", response_model=StatusResponse)
async def get_status(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(Visitor))
    visitor_count = result.scalar() or 0

    return StatusResponse(
        status="healthy",
        version="1.0.0",
        uptime_seconds=round(time.time() - START_TIME, 2),
        visitor_count=visitor_count,
    )
