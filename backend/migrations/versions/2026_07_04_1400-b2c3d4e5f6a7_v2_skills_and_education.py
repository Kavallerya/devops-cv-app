"""v2: drop skills.level, add education table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-07-04 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('skills', 'level')

    op.create_table(
        'education',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('institution', sa.String(length=200), nullable=False),
        sa.Column('degree', sa.String(length=200), nullable=False),
        sa.Column('field', sa.String(length=200), nullable=False),
        sa.Column('period', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_education_id'), 'education', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_education_id'), table_name='education')
    op.drop_table('education')
    op.add_column(
        'skills',
        sa.Column('level', sa.String(length=20), nullable=False, server_default='intermediate'),
    )