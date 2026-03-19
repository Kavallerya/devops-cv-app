from pydantic import BaseModel, ConfigDict


class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    title: str
    summary: str
    email: str
    phone: str | None
    location: str | None
    linkedin: str | None
    github: str | None


class ExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company: str
    role: str
    start_date: str
    end_date: str | None
    description: str
    order: int


class ExperienceListResponse(BaseModel):
    items: list[ExperienceResponse]
    total: int


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    name: str
    level: str


class SkillsListResponse(BaseModel):
    categories: dict[str, list[SkillResponse]]
