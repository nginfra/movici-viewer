def test_get_datasets(get_with_status):
    response = get_with_status("/datasets/", 200)
    assert {ds["name"] for ds in response.json()["datasets"]} == {
        "road_network",
        "mv_network",
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
