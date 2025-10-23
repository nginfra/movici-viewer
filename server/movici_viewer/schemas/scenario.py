from __future__ import annotations

import typing as t

from pydantic import BaseModel


class ScenarioCollection(BaseModel):
    scenarios: t.List[Scenario]


class Scenario(BaseModel):
    uuid: str
    name: str
    display_name: str
    has_timeline: bool
    status: t.Optional[str]
    simulation_info: SimulationInfo
    models: t.List[ScenarioModel]
    datasets: t.List[ScenarioDataset]


class ScenarioModel(BaseModel):
    name: str
    type: str

    class Config:
        extra = "allow"


class ScenarioDataset(BaseModel):
    name: str
    type: str
    uuid: str


class SimulationInfo(BaseModel):
    mode: t.Optional[str] = "time_oriented"
    start_time: int
    reference_time: int
    duration: int
    time_scale: float



class ScenarioConfigResponse(BaseModel):
    result: str
    message: str


ScenarioCollection.update_forward_refs()
Scenario.update_forward_refs()
