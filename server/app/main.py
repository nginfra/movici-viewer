from fastapi import FastAPI
from .routers import scenario_router, dataset_router

app = FastAPI()
app.include_router(scenario_router)
app.include_router(dataset_router)
