from __future__ import annotations

import typing as t

from pydantic import BaseModel, Field


class ViewCollection(BaseModel):
    """Collection of visualization views."""

    views: t.List[View] = Field(description="List of views")


class InView(BaseModel):
    """Input schema for creating or updating a view."""

    name: str = Field(description="View name")
    config: dict = Field(description="View configuration object")


class View(InView):
    """A saved visualization view for a scenario."""

    uuid: str = Field(description="Unique identifier")
    scenario_uuid: str = Field(description="UUID of the parent scenario")


class ViewCrudResponse(BaseModel):
    """Response for view create, update, and delete operations."""

    result: str = Field(description="Operation result status")
    message: str = Field(description="Human-readable result message")
    view_uuid: str = Field(description="UUID of the affected view")


ViewCollection.update_forward_refs()
