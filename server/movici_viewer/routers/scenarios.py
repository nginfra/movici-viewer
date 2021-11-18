from fastapi import APIRouter, Depends

from ..exceptions import NotFound
from ..model.model import Repository
from ..schemas.dataset import DatasetWithData
from ..schemas.scenario import ScenarioCollection, Scenario
from .. import dependencies
from ..schemas.summary import DatasetSummary
from ..schemas.update import UpdateCollection
import typing as t

from ..schemas.view import ViewCollection, ViewCrudResponse, InView

scenario_router = APIRouter(prefix="/scenarios")


@scenario_router.get("/", response_model=ScenarioCollection)
def list_scenarios(repository: Repository = Depends(dependencies.repository)):
    return {"scenarios": repository.get_scenarios()}


@scenario_router.get("/{uuid}", response_model=Scenario)
def get_scenario(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return repository.get_scenario(uuid)


@scenario_router.get("/{uuid}/state", response_model=DatasetWithData)
def get_scenario_state(
    uuid: str,
    timestamp: t.Optional[int] = None,
    dataset_uuid: str = Depends(dependencies.dataset_uuid),
    repository: Repository = Depends(dependencies.repository),
):
    scenario = repository.get_scenario(uuid)
    if not scenario["has_timeline"]:
        raise NotFound("simulation", scenario)

    return repository.get_state(uuid, dataset_uuid, timestamp)


@scenario_router.get("/{uuid}/updates", response_model=UpdateCollection)
def list_updates(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return {"updates": repository.get_updates(uuid)}


@scenario_router.get("/{uuid}/summary", response_model=DatasetSummary)
def get_dataset_summary(
    uuid: str,
    repository: Repository = Depends(dependencies.repository),
    dataset_uuid: str = Depends(dependencies.dataset_uuid),
):
    return repository.get_scenario_summary(scenario_uuid=uuid, dataset_uuid=dataset_uuid)


@scenario_router.get("/{uuid}/views", response_model=ViewCollection)
def list_views(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return {"views": repository.get_views(uuid)}


@scenario_router.post("/{uuid}/views", response_model=ViewCrudResponse)
def add_view(
    uuid: str, payload: InView, repository: Repository = Depends(dependencies.repository)
):
    uuid = repository.add_view(uuid, payload)
    return {"result": "ok", "message": "view created", "view_uuid": uuid}
