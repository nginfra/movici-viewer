import pytest


def test_get_scenarios(get_with_status):
    response = get_with_status("/scenarios/", 200)
    assert [scen["name"] for scen in response.json()["scenarios"]] == [
        "test_scenario",
        "no_updates_scenario",
    ]


def test_get_single_scenario(get_with_status):
    response = get_with_status("/scenarios/test_scenario", 200)
    assert response.json() == {
        "name": "test_scenario",
        "display_name": "Test Scenario",
        "has_timeline": True,
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


@pytest.mark.parametrize(
    "timestamp,expected",
    [
        (None, [False, False]),
        (0, [True, True]),
        (2, [False, True]),
        (3, [False, False]),
    ],
)
def test_get_scenario_state(get_with_status, timestamp, expected):
    params = {"dataset_uuid": "antennas"}
    if timestamp is not None:
        params["timestamp"] = timestamp
    response = get_with_status("/scenarios/test_scenario/state", 200, params=params)
    assert (
        response.json()["data"]["antenna_entities"]["operation_status_properties"]["has_power"]
        == expected
    )


def test_scenario_summary(get_with_status):
    response = get_with_status("/scenarios/test_scenario/summary?dataset_name=antennas", 200)
    assert response.json() == {
        "count": 2,
        "entity_groups": [
            {
                "name": "antenna_entities",
                "count": 2,
                "properties": [
                    {
                        "component": None,
                        "name": "id",
                        "data_type": "INT",
                        "description": "",
                        "unit": "",
                        "min_val": 0,
                        "max_val": 1,
                    },
                    {
                        "component": "point_properties",
                        "name": "position_x",
                        "data_type": "DOUBLE",
                        "description": "",
                        "unit": "",
                        "min_val": 81017.0,
                        "max_val": 81758.0,
                    },
                    {
                        "component": "point_properties",
                        "name": "position_y",
                        "data_type": "DOUBLE",
                        "description": "",
                        "unit": "",
                        "min_val": 454993.0,
                        "max_val": 455843.0,
                    },
                    {
                        "component": "operation_status_properties",
                        "name": "has_power",
                        "data_type": "BOOLEAN",
                        "description": "",
                        "unit": "",
                        "min_val": 0,
                        "max_val": 1,
                    },
                ],
            }
        ],
    }
