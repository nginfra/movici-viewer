from fastapi import APIRouter, Depends, Path

from .. import dependencies
from ..model.model import Repository
from ..schemas.view import InView, View, ViewCrudResponse

view_router = APIRouter(prefix="/views", tags=["Views"])


@view_router.get("/{uuid}", response_model=View, summary="Get a view by UUID")
def get_view(
    uuid: str = Path(description="View UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return a saved visualization view."""
    return repository.get_view(uuid)


@view_router.put("/{uuid}", response_model=ViewCrudResponse, summary="Update a view")
def update_view(
    uuid: str = Path(description="View UUID"),
    payload: InView = ...,
    repository: Repository = Depends(dependencies.repository),
):
    """Update an existing visualization view."""
    uuid = repository.update_view(uuid, payload)
    return {"result": "ok", "message": "view updated", "view_uuid": uuid}


@view_router.delete("/{uuid}", response_model=ViewCrudResponse, summary="Delete a view")
def delete_view(
    uuid: str = Path(description="View UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Delete a visualization view."""
    uuid = repository.delete_view(uuid)
    return {"result": "ok", "message": "view deleted", "view_uuid": uuid}
