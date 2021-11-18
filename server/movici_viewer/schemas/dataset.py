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


class DatasetWithData(Dataset):
    general: t.Optional[dict]
    bounding_box: t.Optional[t.List[float]]
    data: dict


DatasetCollection.update_forward_refs()
