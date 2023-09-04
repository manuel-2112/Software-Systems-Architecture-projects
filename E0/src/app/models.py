from uuid import uuid4

from sqlalchemy import Column, Float, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Event(Base):
    __tablename__ = 'events'
    
    id = Column(Integer, primary_key=True, index=True)
    stocks_id = Column(UUID(as_uuid=True), default=uuid4)
    datetime = Column(String(255))


class Stock(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(255))
    shortName = Column(String(255))
    price = Column(Float)
    currency = Column(String(255))
    source = Column(String(255))

    event_id = Column(Integer, ForeignKey('events.id'))