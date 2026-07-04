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


class SkillsListResponse(BaseModel):
    categories: dict[str, list[SkillResponse]]


class EducationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    institution: str
    degree: str
    field: str
    period: str
    description: str | None
    order: int


class CertificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    issuer: str
    date: str
    expiry_date: str | None
    credential_url: str | None
    badge_url: str | None
    order: int


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    tech_stack: dict | None
    github_url: str | None
    live_url: str | None
    featured: bool
    order: int


class StatusResponse(BaseModel):
    status: str
    version: str
    uptime_seconds: float
    visitor_count: int


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactResponse(BaseModel):
    id: int
    message: str
