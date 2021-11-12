from __future__ import annotations

import typing as t

from pydantic import BaseModel


class DatasetSummary(BaseModel):
    count: int
    entity_groups: t.List[EntityGroupSummary]


class EntityGroupSummary(BaseModel):
    count: int
    name: str
    properties: t.List[PropertySummary]


class PropertySummary(BaseModel):
    component: t.Optional[str] = ...
    name: str
    data_type: str
    description: str
    unit: str
    min_val: float
    max_val: float


EntityGroupSummary.update_forward_refs()
DatasetSummary.update_forward_refs()
