from __future__ import annotations

import typing as t

from pydantic import BaseModel

from ..types import UUID


class UpdateCollection(BaseModel):
    updates: t.List[Update]


class Update(BaseModel):
    uuid: UUID
    name: str
    dataset_uuid: UUID
    scenario_uuid: UUID
    timestamp: int
    iteration: int
    data: t.Optional[dict]


UpdateCollection.update_forward_refs()
