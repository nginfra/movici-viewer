def test_get_datasets(get_with_status):
    response = get_with_status("/datasets/", 200)
    assert {ds["name"] for ds in response.json()["datasets"]} == {
        "road_network",
        "antennas",
    }


def test_get_single_dataset(get_with_status):
    response = get_with_status("/datasets/road_network", 200)
    assert response.json() == {
        "name": "road_network",
        "uuid": "road_network",
        "display_name": "Roads",
        "type": "transport_network",
        "format": "entity_based",
        "has_data": True,
    }


def test_get_dataset_with_data(get_with_status):
    response = get_with_status("/datasets/road_network/data", 200)
    assert response.json().keys() == {
        "name",
        "display_name",
        "type",
        "format",
        "bounding_box",
        "epsg_code",
        "created_on",
        "last_modified",
        "version",
        "general",
        "data",
    }
    assert "road_segment_entities" in response.json()["data"]


def test_get_datasets_data_ignores_query_parameters(get_with_status):
    response = get_with_status("/datasets/road_network/data?entity_group=some_entities", 200)
    assert "road_segment_entities" in response.json()["data"]


def test_dataset_summary(get_with_status):
    response = get_with_status("/datasets/antennas/summary", 200)
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
                        "component": None,
                        "name": "geometry.x",
                        "data_type": "DOUBLE",
                        "description": "",
                        "unit": "",
                        "min_val": 81017.0,
                        "max_val": 81758.0,
                    },
                    {
                        "component": None,
                        "name": "geometry.y",
                        "data_type": "DOUBLE",
                        "description": "",
                        "unit": "",
                        "min_val": 454993.0,
                        "max_val": 455843.0,
                    },
                    {
                        "component": None,
                        "name": "operational.power_source",
                        "data_type": "INT",
                        "description": "",
                        "unit": "",
                        "min_val": 0.0,
                        "max_val": 1.0,
                    },
                ],
            }
        ],
    }
