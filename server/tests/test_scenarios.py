def test_get_scenarios(get_with_status):
    response = get_with_status("/scenarios/", 200)
    assert [scen["name"] for scen in response.json()["scenarios"]] == ["test_scenario"]


def test_get_single_scenario(get_with_status):
    response = get_with_status("/scenarios/test_scenario", 200)
    assert response.json() == {
        "name": "test_scenario",
        "display_name": "Test Scenario",
        "has_timeline": False,
        "status": "ready",
        "uuid": "test_scenario",
        "simulation_info": {
            "mode": "time_oriented",
            "start_time": 0,
            "reference_time": 1,
            "duration": 1,
            "time_scale": 1,
        },
        "models": [],
        "datasets": [],
    }
