import pytest

from movici_viewer.settings import Settings


@pytest.fixture(params=[True, False], ids=["validate updates", "no validate updates"])
def settings(request, data_dir):
    return Settings(DATA_DIR=data_dir, VALIDATE_UPDATES=request.param)


def test_get_updates(get_with_status):
    response = get_with_status("/scenarios/test_scenario/updates", 200)
    assert len(response.json()["updates"]) == 5


def test_get_single_update(get_with_status):
    response = get_with_status("/updates/test_scenario__t3_0_antennas", 200)
    assert response.json() == {
        "uuid": "test_scenario__t3_0_antennas",
        "name": "antennas",
        "dataset_uuid": "antennas",
        "scenario_uuid": "test_scenario",
        "timestamp": 3,
        "iteration": 4,
        "data": {
            "antenna_entities": {
                "id": [1],
                "operational.has_power": [False],
            }
        },
    }
