from fastapi import FastAPI

from .dependencies import get_settings
from .exceptions import add_exception_handling
from .routers import scenario_router, dataset_router, update_router
from .settings import Settings
import typing as t


def get_app(settings: t.Optional[Settings] = None):
    app = FastAPI()
    if settings is not None:
        app.dependency_overrides[get_settings] = lambda: settings
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    add_exception_handling(app)
    return app
