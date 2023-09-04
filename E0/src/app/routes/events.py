from fastapi import APIRouter, HTTPException, status, Query

from app.database import database
from app.models import Event

events_router = APIRouter(prefix="/events")

@events_router.get('/')
async def get_events(
    page: int = Query(1, alias="page", description="Page number"),
    size: int = Query(25, alias="size", description="Number of items per page")
    ):
    offset = (page - 1) * size
    stocks = database.query(Event).offset(offset).limit(size).all()
    if not stocks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There are no stocks in the database")
    return stocks
