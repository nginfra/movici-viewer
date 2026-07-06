from __future__ import annotations

import typing as t

from pydantic import BaseModel, Field


class ScenarioCollection(BaseModel):
    """Collection of scenarios."""

    scenarios: t.List[Scenario] = Field(description="List of scenarios")


class Scenario(BaseModel):
    """A simulation scenario."""

    uuid: str = Field(description="Unique identifier")
    name: str = Field(description="Scenario name")
    display_name: str = Field(description="Human-readable display name")
    has_timeline: bool = Field(description="Whether the scenario has simulation updates")
    simulation_info: SimulationInfo = Field(description="Simulation timing configuration")
    models: t.List[ScenarioModel] = Field(description="Models used in the scenario")
    datasets: t.List[ScenarioDataset] = Field(description="Datasets associated with the scenario")
    status: t.Optional[str] = Field(default=None, description="Scenario status")


class ScenarioModel(BaseModel):
    """A model used in a scenario."""

    name: str = Field(description="Model name")
    type: str = Field(description="Model type")

    class Config:
        extra = "allow"


class ScenarioDataset(BaseModel):
    """A dataset reference within a scenario."""

    name: str = Field(description="Dataset name")
    type: str = Field(description="Dataset type")
    uuid: str = Field(description="Dataset UUID")


class SimulationInfo(BaseModel):
    """Simulation timing and mode configuration."""

    mode: t.Optional[str] = Field(default="time_oriented", description="Simulation mode")
    start_time: int = Field(description="Simulation start time (epoch seconds)")
    reference_time: int = Field(description="Reference time (epoch seconds)")
    duration: int = Field(description="Simulation duration in seconds")
    time_scale: float = Field(description="Time scale factor")


ScenarioCollection.update_forward_refs()
Scenario.update_forward_refs()
