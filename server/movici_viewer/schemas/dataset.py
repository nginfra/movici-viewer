from __future__ import annotations

from pydantic import BaseModel


class DatasetCollection(BaseModel):
    datasets: list[Dataset]


class Dataset(BaseModel):
    uuid: str
    name: str
    display_name: str
    type: str
    format: str
    has_data: bool


class DatasetWithData(Dataset):
    general: dict | None
    bounding_box: list[float] | None
    data: dict


DatasetCollection.update_forward_refs()
