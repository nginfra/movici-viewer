from __future__ import annotations

from pydantic import BaseModel


class DatasetSummary(BaseModel):
    count: int
    entity_groups: list[EntityGroupSummary]


class EntityGroupSummary(BaseModel):
    count: int
    name: str
    properties: list[PropertySummary]


class PropertySummary(BaseModel):
    component: str | None = ...
    name: str
    data_type: str
    description: str
    unit: str
    min_val: float | None = ...
    max_val: float | None = ...


EntityGroupSummary.update_forward_refs()
DatasetSummary.update_forward_refs()
