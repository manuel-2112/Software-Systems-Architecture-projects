from pydantic import BaseModel


# Esquemas de Eventos
class EventBase(BaseModel):
    stocks_id: str
    datetime: str
    stocks: str

class Event(EventBase):
    class Config:
        orm_mode = True

# Esquema de Stocks
class StockBase(BaseModel):
    symbol: str
    shortName: str
    price: float
    currency: str
    source: str

class Stock(StockBase):
    id: int
    event: Event

    class Config:
        orm_mode = True