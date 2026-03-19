from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Skill
from app.schemas import SkillsListResponse, SkillResponse

router = APIRouter()


@router.get("/skills", response_model=SkillsListResponse)
async def get_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.category, Skill.name))
    skills = result.scalars().all()

    categories: dict[str, list[SkillResponse]] = {}
    for skill in skills:
        if skill.category not in categories:
            categories[skill.category] = []
        categories[skill.category].append(SkillResponse.model_validate(skill))

    return SkillsListResponse(categories=categories)
