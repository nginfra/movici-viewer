from __future__ import annotations

import typing as t

from pydantic import BaseModel, Field


class DatasetCollection(BaseModel):
    """Collection of datasets."""

    datasets: t.List[Dataset] = Field(description="List of datasets")


class Dataset(BaseModel):
    """A simulation dataset."""

    uuid: str = Field(description="Unique identifier")
    name: str = Field(description="Dataset name")
    display_name: str = Field(description="Human-readable display name")
    type: str = Field(description="Dataset type (e.g. 'flooding_grid', 'road_network')")
    format: str = Field(description="Data format")
    has_data: bool = Field(description="Whether the dataset contains data")
    general: dict | None = Field(default=None, description="General metadata")
    epsg_code: int | None = Field(
        default=None, description="EPSG coordinate reference system code"
    )


class DatasetWithData(Dataset):
    """A dataset including its entity data and optional bounding box."""

    general: t.Optional[dict] = Field(description="General metadata")
    data: dict = Field(description="Entity data keyed by entity group name")
    bounding_box: t.Optional[t.List[float]] = Field(
        default=None, description="Geographic bounding box [min_lon, min_lat, max_lon, max_lat]"
    )


DatasetCollection.update_forward_refs()
