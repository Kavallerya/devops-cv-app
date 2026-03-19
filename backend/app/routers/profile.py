import hashlib
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Profile, Visitor
from app.schemas import ProfileResponse
from app.metrics import VISITOR_COUNT

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).limit(1))
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()

    existing = await db.execute(select(Visitor).where(Visitor.ip_hash == ip_hash).limit(1))
    if existing.scalar_one_or_none() is None:
        db.add(Visitor(ip_hash=ip_hash))
        await db.commit()
        VISITOR_COUNT.inc()

    return profile
