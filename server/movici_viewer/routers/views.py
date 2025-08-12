from fastapi import APIRouter, Depends

from .. import dependencies
from ..model.model import Repository
from ..schemas.view import InView, View, ViewCrudResponse

view_router = APIRouter(prefix="/views")


@view_router.get("/{uuid}", response_model=View)
def get_view(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return repository.get_view(uuid)


@view_router.put("/{uuid}", response_model=ViewCrudResponse)
def update_view(
    uuid: str, payload: InView, repository: Repository = Depends(dependencies.repository)
):
    uuid = repository.update_view(uuid, payload)
    return {"result": "ok", "message": "view updated", "view_uuid": uuid}


@view_router.delete("/{uuid}", response_model=ViewCrudResponse)
def delete_view(uuid: str, repository: Repository = Depends(dependencies.repository)):
    uuid = repository.delete_view(uuid)
    return {"result": "ok", "message": "view deleted", "view_uuid": uuid}
