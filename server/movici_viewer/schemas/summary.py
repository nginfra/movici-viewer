from __future__ import annotations

import typing as t

from pydantic import BaseModel, Field


class DatasetSummary(BaseModel):
    """Summary statistics for a dataset."""

    count: int = Field(description="Total number of entities")
    entity_groups: t.List[EntityGroupSummary] = Field(description="Per-entity-group summaries")
    general: dict = Field(description="General metadata")


class EntityGroupSummary(BaseModel):
    """Summary for a single entity group within a dataset."""

    count: int = Field(description="Number of entities in this group")
    name: str = Field(description="Entity group name")
    properties: t.List[PropertySummary] = Field(description="Property summaries")


class PropertySummary(BaseModel):
    """Summary of a single property within an entity group."""

    component: t.Optional[str] = Field(..., description="Component name, if applicable")
    name: str = Field(description="Property name")
    data_type: str = Field(description="Data type (e.g. 'INT', 'DOUBLE', 'BOOLEAN')")
    description: str = Field(description="Human-readable property description")
    enum_name: str | None = Field(description="Enum type name, if the property is an enum")
    unit: str = Field(description="Unit of measurement")
    min_val: t.Optional[float] = Field(..., description="Minimum value across all entities")
    max_val: t.Optional[float] = Field(..., description="Maximum value across all entities")


EntityGroupSummary.update_forward_refs()
DatasetSummary.update_forward_refs()
