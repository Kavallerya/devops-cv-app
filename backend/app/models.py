import datetime
from sqlalchemy import String, Text, Integer, DateTime, func, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40), nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(255), nullable=True)
    github: Mapped[str | None] = mapped_column(String(255), nullable=True)


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(String(200), nullable=False)
    start_date: Mapped[str] = mapped_column(String(20), nullable=False)
    end_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    institution: Mapped[str] = mapped_column(String(200), nullable=False)
    degree: Mapped[str] = mapped_column(String(200), nullable=False)
    field: Mapped[str] = mapped_column(String(200), nullable=False)
    period: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Visitor(Base):
    __tablename__ = "visitors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    visited_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class Certification(Base):
    __tablename__ = "certifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    issuer: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    expiry_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    credential_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    badge_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tech_stack: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=0)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(200), nullable=False)
    subject: Mapped[str] = mapped_column(String(300), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
