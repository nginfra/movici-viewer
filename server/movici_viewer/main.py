import typing as t
import logging
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
from .logging_config import setup_logging
from .monitoring import add_monitoring_middleware, setup_health_checks

logger = logging.getLogger(__name__)

__UI_DIR__ = Path(__file__).parent / "ui"


def get_app(settings: t.Optional[Settings] = None, mount_ui=True, allow_cors=False):
    if settings is None:
        settings = Settings()
    
    # Setup logging
    setup_logging(settings)
    logger.info("Starting Movici Viewer application")
    
    app = FastAPI(
        title="Movici Viewer API",
        description="Geospatial data visualization and simulation viewer",
        version="1.0.1"
    )
    
    # Add settings to dependency injection
    app.dependency_overrides[get_settings] = lambda: settings
    
    # Add monitoring and health checks (remove await)
    add_monitoring_middleware(app, settings)
    setup_health_checks(app)
    
    # Add routers
    app.include_router(scenario_router)
    app.include_router(dataset_router)
    app.include_router(update_router)
    app.include_router(view_router)
    
    # Add UI if enabled
    if mount_ui:
        add_ui(app)
    
    # Add CORS if enabled
    if allow_cors:
        setup_cors(app, settings)
    
    # Add exception handling
    add_exception_handling(app)
    
    logger.info("Movici Viewer application initialized successfully")
    return app


def add_ui(app: FastAPI):
    import os
    if os.path.exists(__UI_DIR__):
        app.mount("/ui", StaticFiles(directory=__UI_DIR__, html=True), name="ui")
        if os.path.exists(__UI_DIR__ / "assets"):
            app.mount("/assets", StaticFiles(directory=__UI_DIR__ / "assets", html=True), name="assets")
        if os.path.exists(__UI_DIR__ / "static"):
            app.mount("/static", StaticFiles(directory=__UI_DIR__ / "static", html=True), name="static")
        app.get("/")(lambda: RedirectResponse(url="/ui"))
    else:
        print(f"Warning: UI directory '{__UI_DIR__}' not found. Running API-only mode.")
        app.get("/")(lambda: {"message": "Movici Viewer API - UI not available"})


def setup_cors(app: FastAPI, settings: Settings):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )


@click.command()
@click.argument("directory")
@click.option("--host", "-h", default="localhost")
@click.option("--port", "-p", default=5000)
@click.option("--allow-cors", is_flag=True, default=False)
@click.option("--workers", default=1, help="Number of worker processes")
def main(directory, host, port, allow_cors, workers):
    settings = Settings(DATA_DIR=directory, WORKERS=workers)
    
    # Setup logging before creating app
    setup_logging(settings)
    
    # Create app directly with settings instead of using factory
    app = get_app(settings=settings, mount_ui=True, allow_cors=allow_cors)
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        workers=workers if workers > 1 else None,
        log_level=settings.LOG_LEVEL.value.lower(),
        access_log=True,
    )
