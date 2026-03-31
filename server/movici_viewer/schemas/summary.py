from __future__ import annotations

import typing as t

from pydantic import BaseModel


class DatasetSummary(BaseModel):
    count: int
    entity_groups: t.List[EntityGroupSummary]
    general: dict


class EntityGroupSummary(BaseModel):
    count: int
    name: str
    properties: t.List[PropertySummary]


class PropertySummary(BaseModel):
    component: t.Optional[str] = ...
    name: str
    data_type: str
    description: str
    enum_name: str | None
    unit: str
    min_val: t.Optional[float] = ...
    max_val: t.Optional[float] = ...


EntityGroupSummary.update_forward_refs()
DatasetSummary.update_forward_refs()
