import sys
import os

_api_dir = os.path.dirname(os.path.abspath(__file__))
if _api_dir not in sys.path:
    sys.path.insert(0, _api_dir)

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.sqlite import TEXT  # SQLite 不支持 UUID，存为 TEXT

from api.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class TODO(Base):
    __tablename__ = "todos"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(TEXT, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(2000), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
