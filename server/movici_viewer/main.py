import typing as t
from pathlib import Path

import click
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from .dependencies import get_settings
from .exceptions import add_exception_handling
from .routers import scenario_router, dataset_router, update_router
from .settings import Settings

__UI_DIR__ = Path(__file__).parent / "ui"


def get_app(settings: t.Optional[Settings] = None, mount_ui=True):
    app = FastAPI()
    if settings is not None:
        app.dependency_overrides[get_settings] = lambda: settings
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    if mount_ui:
        add_ui(app)

    add_exception_handling(app)
    return app


def add_ui(app: FastAPI):
    app.mount("/ui", StaticFiles(directory=__UI_DIR__, html=True), name="ui")
    app.mount("/static", StaticFiles(directory=__UI_DIR__ / "static", html=True), name="ui")
    app.get("/")(lambda: RedirectResponse(url="/ui"))


@click.command()
@click.argument("directory")
def main(directory):
    settings = Settings(DATA_DIR=directory)
    app = get_app(settings)
    uvicorn.run(app, host="localhost", port=5000, log_level="info")
