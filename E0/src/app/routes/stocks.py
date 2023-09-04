from json import JSONDecodeError, loads

from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import JSONResponse

from app.database import database
from app.models import Event, Stock
from app.schemas import Event as EventIn

stocks_router = APIRouter(prefix="/stocks")

@stocks_router.get('/')
async def get_stocks(
    page: int = Query(1, alias="page", description="Page number"),
    size: int = Query(25, alias="size", description="Number of items per page")
    ):
    offset = (page - 1) * size
    stocks = database.query(Stock).offset(offset).limit(size).all()
    if not stocks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There are no stocks in the database")
    return stocks

@stocks_router.get('/{symbol}')
async def get_stock(
    symbol: str,
    page: int = Query(1, alias="page", description="Page number"),
    size: int = Query(25, alias="size", description="Number of items per page")
    ):
    offset = (page - 1) * size
    stocks = database.query(Stock).filter(Stock.symbol == symbol).offset(offset).limit(size).all()
    if not stocks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock not found")
    return stocks

@stocks_router.post('/submit')
async def submit_stocks(event: EventIn):
    try:
        stocks_data = loads(event.stocks)
        stocks_list = []
        
        event_data = event.dict()
        del event_data['stocks']

        event_db = Event(**event_data)
        database.add(event_db)
        database.commit()

        for stock_data in stocks_data:
            stock_data['event_id'] = event_db.id
            stock = Stock(**stock_data)
            stocks_list.append(stock)

        database.add_all([stock for stock in stocks_list])
        database.commit()

        return JSONResponse(content=stocks_data)
    
    except JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON format for the stocks")
