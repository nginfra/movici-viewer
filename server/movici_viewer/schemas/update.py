from __future__ import annotations

from pydantic import BaseModel


class UpdateCollection(BaseModel):
    updates: list[Update]


class Update(BaseModel):
    uuid: str
    name: str
    dataset_uuid: str
    scenario_uuid: str
    timestamp: int
    iteration: int
    data: dict | None = None


UpdateCollection.update_forward_refs()
