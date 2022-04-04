import typing as t
from pathlib import Path

import click
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from .dependencies import get_settings
from .exceptions import add_exception_handling
from .routers import scenario_router, dataset_router, update_router, view_router
from .settings import Settings

__UI_DIR__ = Path(__file__).parent / "ui"


def get_app(settings: t.Optional[Settings] = None, mount_ui=True, allow_cors=False):
    app = FastAPI()
    if settings is not None:
        app.dependency_overrides[get_settings] = lambda: settings
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    app.include_router(view_router)
    if mount_ui:
        add_ui(app)
    if allow_cors:
        setup_cors(app)
    add_exception_handling(app)
    return app


def add_ui(app: FastAPI):
    app.mount("/ui", StaticFiles(directory=__UI_DIR__, html=True), name="ui")
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


@click.command()
@click.argument("directory")
@click.option("--host", "-h", default="localhost")
@click.option("--port", "-p", default=5000)
@click.option("--allow-cors", is_flag=True, default=False)
def main(directory, host, port, allow_cors):
    settings = Settings(DATA_DIR=directory)
    app = get_app(settings, allow_cors=allow_cors)
    uvicorn.run(app, host=host, port=port, log_level="info")
