from pathlib import Path

import pytest as pytest
from fastapi.testclient import TestClient

from movici_simulation_core.data_tracker.numba_extensions import disable_jit
from movici_viewer.caching import cache_clear
from movici_viewer.main import get_app
from movici_viewer.settings import Settings
from movici_viewer import dependencies


@pytest.fixture(scope='session')
def disable_numba():
    disable_jit()


@pytest.fixture
def data_dir():
    return Path(__file__).parent / "data"


@pytest.fixture
def settings(data_dir):
    return Settings(DATA_DIR=data_dir)


@pytest.fixture
def app(settings, disable_numba):
    def override():
        return settings

    cache_clear()
    app = get_app(mount_ui=False)
    app.dependency_overrides[dependencies.get_settings] = override

    return app


@pytest.fixture
def client(app):
    return TestClient(app)


@pytest.fixture
def get_with_status(client):
    def _get(url, expected_status, **kwargs):
        response = client.get(url, **kwargs)
        assert response.status_code == expected_status, response.json()
        return response

    return _get
