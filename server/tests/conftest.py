import functools
from pathlib import Path

import pytest as pytest
from fastapi.testclient import TestClient

from movici_viewer.caching import cache_clear
from movici_viewer.main import get_app
from movici_viewer.settings import Settings
from movici_viewer import dependencies



@pytest.fixture
def base_data_dir():
    return Path(__file__).parent / "data"


@pytest.fixture
def data_dir(base_data_dir):
    """this fixture can be overridden, for example with a temporary directory, while base_data_dir
    remains available to use"""
    return base_data_dir


@pytest.fixture
def settings(data_dir):
    return Settings(DATA_DIR=data_dir)


@pytest.fixture
def app(settings):
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
def request_with_status(client):
    def _request(method, url, expected_status, **kwargs):
        response = client.request(method, url, **kwargs)
        assert response.status_code == expected_status, response.json()
        return response

    return _request


@pytest.fixture
def get_with_status(request_with_status):
    return functools.partial(request_with_status, "get")
