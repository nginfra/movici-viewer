from __future__ import annotations

import typing as t

from pydantic import BaseModel


class UpdateCollection(BaseModel):
    updates: t.List[Update]


class Update(BaseModel):
    uuid: str
    name: str
    dataset_uuid: str
    scenario_uuid: str
    timestamp: int
    iteration: int
    data: t.Optional[dict]


UpdateCollection.update_forward_refs()
