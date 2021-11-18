from __future__ import annotations

import typing as t

from pydantic import BaseModel


class ViewCollection(BaseModel):
    views: t.List[View]


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
