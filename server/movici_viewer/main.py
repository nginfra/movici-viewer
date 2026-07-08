import typing as t
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from .dependencies import get_settings
from .exceptions import add_exception_handling
from .routers import dataset_router, scenario_router, update_router, view_router
from .settings import Settings

__UI_DIR__ = Path(__file__).parent / "ui"


def get_app(settings: t.Optional[Settings] = None, mount_ui=True):
    app = FastAPI(
        title="Movici Viewer API",
        description=(
            "REST API for the Movici geospatial simulation viewer. "
            "Provides access to datasets, scenarios, simulation updates, "
            "and visualization views."
        ),
        version="1.1.1",
        openapi_tags=[
            {"name": "Datasets", "description": "Access simulation datasets and their summaries"},
            {
                "name": "Scenarios",
                "description": ("Access simulation scenarios, their state, updates, and views"),
            },
            {"name": "Updates", "description": "Retrieve simulation update data"},
            {"name": "Views", "description": "Manage visualization views for scenarios"},
        ],
    )
    if settings is not None:
        app.dependency_overrides[get_settings] = lambda: settings
    else:
        settings = get_settings()
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    app.include_router(view_router)
    if mount_ui:
        add_ui(app)
    if settings.ALLOW_CORS:
        setup_cors(app)
    add_exception_handling(app)
    return app


def add_ui(app: FastAPI):
    app.mount("/ui", StaticFiles(directory=__UI_DIR__, html=True), name="ui")
    app.mount("/assets", StaticFiles(directory=__UI_DIR__ / "assets", html=True), name="ui")
    app.mount("/static", StaticFiles(directory=__UI_DIR__ / "static", html=True), name="ui")
    app.get("/")(lambda: RedirectResponse(url="/ui"))


def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
