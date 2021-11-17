from fastapi import APIRouter, Depends

from .. import dependencies
from ..model.model import Repository
from ..schemas.update import Update

update_router = APIRouter(prefix="/updates")


@update_router.get("/{uuid}", response_model=Update)
def get_update(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return repository.get_update(uuid)
