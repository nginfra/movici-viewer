from __future__ import annotations

import typing as t

from pydantic import BaseModel


class DatasetCollection(BaseModel):
    datasets: t.List[Dataset]


class Dataset(BaseModel):
    uuid: str
    name: str
    display_name: str
    type: str
    format: str
    has_data: bool
    general: dict | None = None
    epsg_code: int | None = None


class DatasetWithData(Dataset):
    general: t.Optional[dict]
    data: dict
    bounding_box: t.Optional[t.List[float]] = None


DatasetCollection.update_forward_refs()
