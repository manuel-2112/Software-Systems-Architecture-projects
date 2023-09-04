from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.stocks import stocks_router
from app.routes.events import events_router

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title='Stock Tracking API',
    description='Api to track stocks from different sources. By: Manuel Espinoza [github: @manuel-2112]',
)


app.include_router(stocks_router , tags=["Stocks"])
app.include_router(events_router , tags=["Events"])

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return "Root of the API. Go to /stocks/ to see the stocks."
