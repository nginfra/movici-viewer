from __future__ import annotations

from pydantic import BaseModel


class ScenarioCollection(BaseModel):
    scenarios: list[Scenario]


class Scenario(BaseModel):
    uuid: str
    name: str
    display_name: str
    has_timeline: bool
    status: str | None
    simulation_info: SimulationInfo
    models: list[ScenarioModel]
    datasets: list[ScenarioDataset]


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
    mode: str | None = "time_oriented"
    start_time: int
    reference_time: int
    duration: int
    time_scale: float


ScenarioCollection.update_forward_refs()
Scenario.update_forward_refs()
