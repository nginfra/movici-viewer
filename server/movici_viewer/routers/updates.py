import orjson as json
from fastapi import APIRouter, Depends, Path
from fastapi.responses import ORJSONResponse, Response

from .. import dependencies
from ..model.model import Repository
from ..schemas.update import Update
from ..settings import Settings

update_router = APIRouter(prefix="/updates", tags=["Updates"])


@update_router.get(
    "/{uuid}",
    response_model=Update,
    response_class=ORJSONResponse,
    summary="Get an update by UUID",
)
def get_update(
    uuid: str = Path(description="Update UUID"),
    repository: Repository = Depends(dependencies.repository),
    settings: Settings = Depends(dependencies.get_settings),
):
    """Return simulation update data for a specific update."""
    update = repository.get_update(uuid)
    if settings.VALIDATE_UPDATES:
        return update
    return Response(
        json.dumps(update), status_code=200, headers=None, media_type="application/json"
    )
