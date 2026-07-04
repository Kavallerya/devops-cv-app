"""portfolio expansion: certifications, projects, contact_messages

Revision ID: a1b2c3d4e5f6
Revises: 4335e6f7061a
Create Date: 2026-07-04 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '4335e6f7061a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'certifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('issuer', sa.String(length=200), nullable=False),
        sa.Column('date', sa.String(length=20), nullable=False),
        sa.Column('expiry_date', sa.String(length=20), nullable=True),
        sa.Column('credential_url', sa.String(length=500), nullable=True),
        sa.Column('badge_url', sa.String(length=500), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_certifications_id'), 'certifications', ['id'], unique=False)

    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('tech_stack', sa.JSON(), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('live_url', sa.String(length=500), nullable=True),
        sa.Column('featured', sa.Boolean(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)

    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=200), nullable=False),
        sa.Column('subject', sa.String(length=300), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_contact_messages_id'), 'contact_messages', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_contact_messages_id'), table_name='contact_messages')
    op.drop_table('contact_messages')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')
    op.drop_table('projects')
    op.drop_index(op.f('ix_certifications_id'), table_name='certifications')
    op.drop_table('certifications')