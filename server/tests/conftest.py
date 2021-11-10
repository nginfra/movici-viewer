from pathlib import Path

import pytest as pytest
from fastapi.testclient import TestClient

from ..app.caching import cache_clear
from ..app.main import app as app_
from ..app.settings import Settings
from ..app import dependencies

@pytest.fixture
def data_dir():
    return Path(__file__).parent / "data"


@pytest.fixture
def settings(data_dir):
    return Settings(DATA_DIR=data_dir)


@pytest.fixture
def app(settings):
    def override():
        return settings

    cache_clear()
    app_.dependency_overrides[dependencies.get_settings] = override

    return app_


@pytest.fixture
def client(app):
    return TestClient(app)

@pytest.fixture
def get_with_status(client):
    def _get(url, expected_status, **kwargs):
        response = client.get(url, **kwargs)
        assert response.status_code == expected_status
        return response
    return _get