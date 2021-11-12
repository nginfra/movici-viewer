from __future__ import annotations

import dataclasses
import re
import typing as t
from collections import defaultdict
from json import JSONDecodeError
from pathlib import Path

import itertools
import numpy as np
import orjson as json

from movici_simulation_core.core.schema import AttributeSchema, PropertySpec, DataType
from movici_simulation_core.data_tracker.data_format import (
    EntityInitDataFormat,
    extract_dataset_data,
)
from movici_simulation_core.data_tracker.index import Index
from movici_simulation_core.data_tracker.property import (
    OPT,
    PropertyObject,
    property_min,
    property_max,
)
from movici_simulation_core.data_tracker.state import TrackedState
from movici_simulation_core.postprocessing.results import (
    SimulationResults,
    ResultDataset,
)
from movici_simulation_core.types import PropertyIdentifier
from movici_simulation_core.utils.plugin import configure_global_plugins
from ...app.caching import memoize, cache_clear
from ...app.exceptions import NotFound, InvalidObject
from ...app.types import UUID


class Repository:
    result_datasets: t.Dict[str, ResultDataset]
    active_scenario: t.Optional[UUID] = None
    scenario_results: t.Optional[SimulationResults] = None

    def __init__(self, data_dir, use_global_plugins=True):
        self.schema = AttributeSchema()
        if use_global_plugins:
            configure_global_plugins(self.schema)
        self.source = DirectorySource(Path(data_dir), self.schema)
        self.source.validate()
        self.set_active_scenario(None)

    def get_scenarios(self):
        return list(self.source.get_scenarios())

    def get_scenario(self, uuid: UUID):
        return self.source.get_scenario(uuid)

    def get_datasets(self):
        return list(self.source.get_datasets())

    def get_dataset(self, uuid: UUID):
        return self.source.get_dataset(uuid)

    def get_dataset_data(self, uuid: UUID) -> Path:
        return self.source.get_dataset_path(uuid)

    def get_state(self, scenario_uuid: UUID, dataset_uuid: UUID, timestamp: t.Optional = None):

        if self.active_scenario != scenario_uuid:
            self.set_active_scenario(scenario_uuid)
        if dataset_uuid not in self.result_datasets:
            self.result_datasets[dataset_uuid] = self.scenario_results.get_dataset(dataset_uuid)
        dataset = self.result_datasets[dataset_uuid]

        if timestamp is None or timestamp > dataset.state.last_timestamp:
            timestamp = dataset.state.last_timestamp
        dataset.state.move_to(timestamp)
        return {
            **dataset.metadata.copy(),
            "has_data": True,
            "data": EntityInitDataFormat().dump_dict(dataset.state.to_dict()[dataset.name]),
        }

    def get_updates(self, scenario_uuid: UUID):
        return list(self.source.get_updates(scenario_uuid))

    def get_update(self, update_uuid: UUID):
        return self.source.get_update(update_uuid)

    def get_dataset_summary(self, dataset_uuid):
        return self.source.get_dataset_summary(dataset_uuid)

    def get_scenario_summary(self, scenario_uuid, dataset_uuid):
        return self.source.get_scenario_summary(scenario_uuid, dataset_uuid)

    def cache_clear(self):
        self.set_active_scenario(None)
        self.source.cache_clear()
        cache_clear()

    def set_active_scenario(self, scenario):
        self.active_scenario = scenario
        self.result_datasets = {}
        self.scenario_results = self.source.get_results(scenario) if scenario is not None else None


class DirectorySource:
    INIT_DATA = "init_data"
    SCENARIOS = "scenarios"
    VIEWS = "views"
    UPDATE_PATTERN = r"t(?P<timestamp>\d+)_(?P<iteration>\d+)_(?P<dataset>\w+)"

    updates: t.Dict[UUID, UpdateInfo] = {}
    updates_by_scenario: t.Dict[UUID, t.Dict[UUID, UpdateInfo]] = defaultdict(dict)

    def __init__(self, data_dir: Path, schema: AttributeSchema):
        self.dir = data_dir
        self.schema = schema
        self.cache_clear()

    def cache_clear(self):
        self.updates = {}
        self.updates_by_scenario = defaultdict(dict)

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
        self.build_updates_index(scenario)
        return self.updates_by_scenario[scenario].values()

    def build_updates_index(self, scenario: UUID):
        if scenario in self.updates_by_scenario:
            return

        path = self.get_updates_path(scenario)

        updates = [info for file in path.glob("*.json") if (info := self.get_update_info(file))]
        updates.sort(key=lambda u: (u.timestamp, u.iteration))
        counter = itertools.count()
        for upd in updates:
            upd.iteration = next(counter)
            self.updates_by_scenario[scenario][upd.uuid] = upd
            self.updates[upd.uuid] = upd

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

    def get_datasets(self):
        for name in self.iter_dataset_names():
            yield self.get_dataset(name)

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

    @memoize
    def get_results(self, scenario: str) -> SimulationResults:
        updates_dir = self.get_updates_path(scenario)
        return SimulationResults(
            init_data_dir=self.init_data_dir,
            updates_dir=updates_dir,
            attributes=self.schema,
        )

    def get_updates(self, scenario: UUID):
        for update in self.iter_updates(scenario):
            yield update.as_dict()

    def get_update(self, update_uuid: UUID):
        if "__" not in update_uuid:
            raise NotFound("update", update_uuid)
        scenario, filename = update_uuid.split("__")
        self.build_updates_index(scenario)

        if not (info := self.updates.get(update_uuid)):
            raise NotFound("update", update_uuid)

        try:
            name, data = next(extract_dataset_data(json.loads(info.path.read_bytes())))
        except StopIteration as e:
            raise InvalidObject("update", update_uuid, e) from e
        return {**info.as_dict(), "data": data}

    def get_update_info(self, path: Path) -> t.Optional[UpdateInfo]:
        matcher = re.compile(self.UPDATE_PATTERN)
        if match := matcher.match(path.stem):
            return UpdateInfo(path=path, scenario=path.parent.name, **match.groupdict())
        return None

    @memoize
    def get_dataset_summary(self, dataset: UUID):
        path = self.get_dataset_path(dataset)
        data = EntityInitDataFormat(self.schema, cache_inferred_attributes=True).load_bytes(
            path.read_bytes()
        )
        state = TrackedState(track_unknown=True)
        state.receive_update(data, is_initial=True)
        return get_summary_from_state(state)

    @memoize
    def get_scenario_summary(self, scenario: UUID, dataset: UUID):
        results = self.get_results(scenario).get_dataset(dataset)
        state = results.state
        min_max: t.Dict[str, t.Dict[PropertyIdentifier, t.Tuple[float, float]]] = defaultdict(dict)
        for timestamp in state.get_timestamps(dataset):
            state.move_to(timestamp)
            for (dataset, entity_type, identifier, prop) in state.iter_properties():
                if identifier not in min_max[entity_type]:
                    min_max[entity_type][identifier] = (property_min(prop), property_max(prop))
                else:
                    curr_min, curr_max = min_max[entity_type][identifier]
                    min_val = (
                        property_min(prop)
                        if curr_min is None
                        else min(curr_min, property_min(prop))
                    )
                    max_val = (
                        property_max(prop)
                        if curr_max is None
                        else max(curr_max, property_max(prop))
                    )
                    min_max[entity_type][identifier] = (min_val, max_val)

        return get_summary_from_state(state, extreme_values=min_max)


@dataclasses.dataclass
class UpdateInfo:
    dataset: UUID
    scenario: UUID
    timestamp: int
    iteration: int
    path: Path

    @property
    def uuid(self):
        return f"{self.scenario}__{self.path.stem}"

    def as_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.dataset,
            "timestamp": self.timestamp,
            "iteration": self.iteration,
            "dataset_uuid": self.dataset,
            "scenario_uuid": self.scenario,
        }


def get_scenario_status(scenario: dict):
    return "completed" if scenario.get("has_timeline") else "ready"


def dataset_format_from_type(dataset_type):
    return "unstructured" if dataset_type == "tabular" else "entity_based"


def get_summary_from_state(
    state: TrackedState,
    extreme_values: t.Optional[
        t.Dict[str, t.Dict[PropertyIdentifier, t.Tuple[float, float]]]
    ] = None,
):
    extreme_values = extreme_values or {}
    summary_per_entity = {}
    summary_dataset = None
    entity_counts = {}
    for (dataset, entity_type, identifier, prop) in state.iter_properties():
        if summary_dataset is None:
            summary_dataset = dataset
        if dataset != summary_dataset:
            raise ValueError("Can only make a summary of one dataset")
        if entity_type not in summary_per_entity:
            index = state.index[dataset][entity_type]
            summary_per_entity[entity_type] = [get_id_summary(index)]
            entity_counts[entity_type] = len(index)
        summary_per_entity[entity_type].append(
            get_property_summary(identifier, prop, extreme_values.get(entity_type, {}))
        )
    return {
        "count": sum(entity_counts.values()),
        "entity_groups": [
            {
                "name": entity_type,
                "count": entity_counts[entity_type],
                "properties": properties,
            }
            for entity_type, properties in summary_per_entity.items()
        ],
    }


def get_id_summary(index: Index):
    return {
        "component": None,
        "name": "id",
        "data_type": "INT",
        "description": "",
        "unit": "",
        "min_val": float(np.min(index.ids)),
        "max_val": float(np.max(index.ids)),
    }


def get_property_summary(
    identifier: PropertyIdentifier,
    prop: PropertyObject,
    extreme_values: t.Optional[t.Dict[PropertyIdentifier, t.Tuple[float, float]]] = None,
):
    if extreme_values and identifier in extreme_values:
        min_val, max_val = extreme_values[identifier]
    else:
        min_val, max_val = float(property_min(prop)), float(property_max(prop))

    return {
        "component": identifier[0],
        "name": identifier[1],
        "data_type": get_datatype_string(prop.data_type),
        "description": "",
        "unit": "",
        "min_val": min_val,
        "max_val": max_val,
    }


def get_datatype_string(datatype: DataType):
    if datatype.csr:
        return "LIST"
    if len(datatype.unit_shape):
        return "TUPLE"
    return {int: "INT", float: "DOUBLE", bool: "BOOLEAN", str: "STR"}[datatype.py_type]
