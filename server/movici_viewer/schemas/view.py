from __future__ import annotations

from pydantic import BaseModel


class ViewCollection(BaseModel):
    views: list[View]


class InView(BaseModel):
    name: str
    config: dict


class View(InView):
    uuid: str
    scenario_uuid: str


class ViewCrudResponse(BaseModel):
    result: str
    message: str
    view_uuid: str


ViewCollection.update_forward_refs()
