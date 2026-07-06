from __future__ import annotations

import typing as t

from pydantic import BaseModel, Field


class UpdateCollection(BaseModel):
    """Collection of simulation updates."""

    updates: t.List[Update] = Field(description="List of updates")


class Update(BaseModel):
    """A simulation update at a specific timestamp and iteration."""

    uuid: str = Field(description="Unique identifier")
    name: str = Field(description="Update name")
    dataset_uuid: str = Field(description="UUID of the dataset this update applies to")
    scenario_uuid: str = Field(description="UUID of the parent scenario")
    timestamp: int = Field(description="Simulation timestamp")
    iteration: int = Field(description="Simulation iteration number")
    data: t.Optional[dict] = Field(default=None, description="Update data payload")


UpdateCollection.update_forward_refs()
