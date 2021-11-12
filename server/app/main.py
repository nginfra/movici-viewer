from fastapi import FastAPI

from .exceptions import add_exception_handling
from .routers import scenario_router, dataset_router, update_router


def get_app():
    app = FastAPI()
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    add_exception_handling(app)
    return app


app = get_app()
