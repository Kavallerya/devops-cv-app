"""initial

Revision ID: 4335e6f7061a
Revises: 
Create Date: 2026-03-19 22:07:00.474418

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4335e6f7061a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "profile",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("email", sa.String(120), nullable=False),
        sa.Column("phone", sa.String(40), nullable=True),
        sa.Column("location", sa.String(120), nullable=True),
        sa.Column("linkedin", sa.String(255), nullable=True),
        sa.Column("github", sa.String(255), nullable=True),
    )

    op.create_table(
        "experience",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("company", sa.String(200), nullable=False),
        sa.Column("role", sa.String(200), nullable=False),
        sa.Column("start_date", sa.String(20), nullable=False),
        sa.Column("end_date", sa.String(20), nullable=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False, server_default="0"),
    )

    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("level", sa.String(20), nullable=False, server_default="intermediate"),
    )

    op.create_table(
        "visitors",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("ip_hash", sa.String(64), nullable=False, index=True),
        sa.Column(
            "visited_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )


def downgrade() -> None:
    op.drop_table("visitors")
    op.drop_table("skills")
    op.drop_table("experience")
    op.drop_table("profile")
