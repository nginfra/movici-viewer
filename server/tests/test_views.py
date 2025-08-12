import json
import shutil
import typing as t

import pytest


@pytest.fixture
def tmp_data_dir(base_data_dir, tmp_path_factory):
    data_dir = tmp_path_factory.mktemp("data")
    shutil.copytree(base_data_dir, data_dir, dirs_exist_ok=True)
    return data_dir


@pytest.fixture
def data_dir_without_views(tmp_data_dir):
    shutil.rmtree(tmp_data_dir / "views", ignore_errors=True)
    return tmp_data_dir


class TestPartialDataDir:
    @pytest.fixture
    def data_dir_with_empty_views_dir(self, data_dir_without_views):
        data_dir_without_views.joinpath("views").mkdir()
        return data_dir_without_views

    @pytest.fixture
    def data_dir_with_scenario_dir_in_views_dir_but_no_views(self, data_dir_with_empty_views_dir):
        data_dir_with_empty_views_dir.joinpath("test_scenario").mkdir()
        return data_dir_with_empty_views_dir

    @pytest.fixture(
        params=[
            "data_dir_without_views",
            "data_dir_with_empty_views_dir",
            "data_dir_with_scenario_dir_in_views_dir_but_no_views",
        ]
    )
    def data_dir(self, request):
        return request.getfixturevalue(request.param)

    def test_get_views_on_partially_initiated_directory(self, get_with_status):
        response = get_with_status("/scenarios/test_scenario/views", 200)
        assert response.json() == {"views": []}


def contains(keys: t.Sequence):
    class Contains:
        def __init__(self, keys: t.Sequence):
            self.keys = set(keys)

        def __eq__(self, other):
            if not isinstance(other, dict):
                return NotImplemented
            return self.keys.issubset(other.keys())

        def __str__(self):
            return "Dictionary that contains the keys: " + ", ".join(self.keys)

        def __repr__(self):
            return str(self)

    return Contains(keys)


def test_get_views(get_with_status):
    response = get_with_status("/scenarios/test_scenario/views", 200)
    assert [view["name"] for view in response.json()["views"]] == ["Test View"]


def test_get_view(get_with_status):
    response = get_with_status("/views/test_scenario__test_view", 200)
    assert response.json() == {
        "uuid": "test_scenario__test_view",
        "scenario_uuid": "test_scenario",
        "name": "Test View",
        "config": contains(["version", "visualizers", "camera"]),
    }


class TestAddView:
    @pytest.fixture
    def data_dir(self, tmp_data_dir):
        return tmp_data_dir

    def test_can_add_view(self, request_with_status):
        response = request_with_status(
            "post",
            "/scenarios/test_scenario/views",
            200,
            json={"name": "Another View", "config": {}},
        )
        assert response.json() == {
            "result": "ok",
            "message": "view created",
            "view_uuid": "test_scenario__another_view",
        }

    def test_add_view_stores_view(self, request_with_status, data_dir):
        payload = {"name": "Another View", "config": {}}
        request_with_status(
            "post",
            "/scenarios/no_updates_scenario/views",
            200,
            json=payload,
        )
        assert (
            json.loads(data_dir.joinpath("views/no_updates_scenario/another_view.json").read_text())
            == payload
        )

    def test_fails_on_conflict(self, request_with_status):
        response = request_with_status(
            "post",
            "/scenarios/test_scenario/views",
            409,
            json={"name": "test_view", "config": {}},
        )

        assert response.json() == {
            "message": "view 'test_view' already exists",
        }

    def test_fails_on_non_existing_scenarios(self, request_with_status):
        response = request_with_status(
            "post",
            "/scenarios/invalid/views",
            404,
            json={"name": "test_view", "config": {}},
        )

        assert response.json() == {
            "message": "scenario 'invalid' not found",
        }

    @pytest.mark.parametrize(
        "body",
        (
            None,
            {},
            {"name": "missing config"},
            {"config": {"missing": "name"}},
        ),
    )
    def test_fails_on_invalid_body(self, body, request_with_status):
        request_with_status(
            "post",
            "/scenarios/test_scenario/views",
            400,
            json=body,
        )


class TestUpdateView:
    @pytest.fixture
    def data_dir(self, tmp_data_dir):
        return tmp_data_dir

    def test_can_update_view(self, request_with_status):
        response = request_with_status(
            "put",
            "/views/test_scenario__test_view",
            200,
            json={"name": "new name", "config": {}},
        )
        assert response.json() == {
            "result": "ok",
            "message": "view updated",
            "view_uuid": "test_scenario__test_view",
        }

    def test_update_view_stores_view(self, request_with_status, data_dir):
        payload = {"name": "new name", "config": {"some": "payload"}}
        request_with_status(
            "put",
            "/views/test_scenario__test_view",
            200,
            json=payload,
        )
        assert (
            json.loads(data_dir.joinpath("views/test_scenario/test_view.json").read_text())
            == payload
        )

    def test_404_on_not_found(self, request_with_status):
        request_with_status(
            "put",
            "/views/not_found_view",
            404,
            json={"name": "new name", "config": {}},
        )


class TestDeleteView:
    @pytest.fixture
    def data_dir(self, tmp_data_dir):
        return tmp_data_dir

    def test_can_delete_view(self, request_with_status):
        response = request_with_status(
            "delete",
            "/views/test_scenario__test_view",
            200,
        )
        assert response.json() == {
            "result": "ok",
            "message": "view deleted",
            "view_uuid": "test_scenario__test_view",
        }

    def test_delete_view_deletes_file(self, request_with_status, data_dir):
        view_path = data_dir.joinpath("views/test_scenario/test_view.json")
        assert view_path.is_file()

        request_with_status(
            "delete",
            "/views/test_scenario__test_view",
            200,
        )
        assert not view_path.is_file()

    def test_404_on_not_found(self, request_with_status):
        request_with_status(
            "delete",
            "/views/not_found_view",
            404,
        )
