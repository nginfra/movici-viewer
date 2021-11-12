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
                "operation_status_properties": {"has_power": [False]},
            }
        },
    }
