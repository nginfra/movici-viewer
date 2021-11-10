from json import JSONDecodeError
from pathlib import Path

import orjson as json

from movici_simulation_core.core.schema import AttributeSchema
from movici_simulation_core.postprocessing.results import SimulationResults
from movici_simulation_core.utils.plugin import configure_global_plugins
from server.app.caching import memoize
from server.app.exceptions import NotFound, InvalidObject


class Repository:
    def __init__(self, data_dir, use_global_plugins=True):
        self.schema = AttributeSchema()
        if use_global_plugins:
            configure_global_plugins(self.schema)
        self.source = DirectorySource(data_dir, self.schema)
        self.source.validate()
        self.active_scenario = None

    def get_scenarios(self):
        return list(self.source.get_scenarios())

    def get_scenario(self, uuid: str):
        return self.source.get_scenario(uuid)

    def get_datasets(self):
        return list(self.source.get_datasets())

    def get_dataset(self, uuid: str):
        return self.source.get_dataset(uuid)


class DirectorySource:
    INIT_DATA = "init_data"
    SCENARIOS = "scenarios"
    VIEWS = "views"

    def __init__(self, data_dir: Path, schema: AttributeSchema):
        self.dir = data_dir
        self.schema = schema

    def validate(self):
        required_dirs = (self.INIT_DATA, self.SCENARIOS)
        for path in required_dirs:
            if not self.dir.joinpath(path).is_dir():
                raise OSError(f"{path} must be a valid subdirectory in {str(self.dir)}")

    @property
    def init_data_dir(self):
        return self.dir / self.INIT_DATA

    @property
    def scenario_dir(self):
        return self.dir / self.SCENARIOS

    def iter_scenario_names(self):
        for file in self.scenario_dir.glob("*.json"):
            yield file.stem

    def iter_dataset_names(self):
        for file in self.init_data_dir.glob("*.json"):
            yield file.stem

    def iter_updates(self, scenario):
        self.get_updates_path(scenario)

    def get_scenario_path(self, scenario: str):
        path = self.dir / self.SCENARIOS / f"{scenario}.json"
        if not path.is_file():
            raise NotFound("scenario", scenario)
        return path

    def get_dataset_path(self, dataset: str):
        path = self.dir / self.INIT_DATA / f"{dataset}.json"
        if not path.is_file():
            raise NotFound("dataset", dataset)
        return path

    def get_updates_path(self, scenario):
        updates_dir = self.scenario_dir / scenario
        if not updates_dir.is_dir():
            raise NotFound("simulation", scenario)
        return updates_dir

    def get_scenario(self, scenario: str) -> dict:
        def has_timeline(scenario):
            try:
                self.get_updates_path(scenario)
                return True
            except NotFound:
                return False

        path = self.get_scenario_path(scenario)
        try:
            result = json.loads(path.read_bytes())
        except (JSONDecodeError, OSError) as e:
            raise InvalidObject("scenario", scenario, exception=e)
        return {
            **result,
            "uuid": scenario,
            "has_timeline": has_timeline(scenario),
            "status": get_scenario_status(result),
        }

    def get_scenarios(self):
        for name in self.iter_scenario_names():
            yield self.get_scenario(name)

    @memoize
    def get_dataset(self, dataset_name):
        path = self.get_dataset_path(dataset_name)
        try:
            result = json.loads(path.read_bytes())
        except (JSONDecodeError, OSError) as e:
            raise InvalidObject("dataset", dataset_name, exception=e)

        return {
            "uuid": dataset_name,
            "name": dataset_name,
            "display_name": result.get("display_name"),
            "type": result.get("type"),
            "format": dataset_format_from_type(result.get("type")),
            "has_data": "data" in result,
        }

    def get_datasets(self):
        for name in self.iter_dataset_names():
            yield self.get_dataset(name)

    def get_results(self, scenario: str) -> SimulationResults:
        updates_dir = self.get_updates_path(scenario)
        return SimulationResults(
            init_data_dir=self.init_data_dir,
            updates_dir=updates_dir,
            attributes=self.schema,
        )


def get_scenario_status(scenario: dict):
    return "completed" if scenario.get("has_timeline") else "ready"


def dataset_format_from_type(dataset_type):
    return "unstructured" if dataset_type == "tabular" else "entity_based"
