"""add_status_to_users

Revision ID: 1d3b12d55f0d
Revises: 
Create Date: 2026-05-31 13:25:38.831081

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d3b12d55f0d'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('status', sa.Enum('Active', 'Inactive', 'Deleted', name='user_status_enum'), server_default='Active', nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'status')
