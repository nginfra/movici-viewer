import typing as t

from fastapi import APIRouter, Depends, Path, Query

from .. import dependencies
from ..exceptions import NotFound
from ..model.model import Repository
from ..schemas.dataset import DatasetWithData
from ..schemas.scenario import Scenario, ScenarioCollection
from ..schemas.summary import DatasetSummary
from ..schemas.update import UpdateCollection
from ..schemas.view import InView, ViewCollection, ViewCrudResponse

scenario_router = APIRouter(prefix="/scenarios", tags=["Scenarios"])


@scenario_router.get("/", response_model=ScenarioCollection, summary="List all scenarios")
def list_scenarios(repository: Repository = Depends(dependencies.repository)):
    """Return all scenarios available in the simulation data directory."""
    return {"scenarios": repository.get_scenarios()}


@scenario_router.get("/{uuid}", response_model=Scenario, summary="Get a scenario by UUID")
def get_scenario(
    uuid: str = Path(description="Scenario UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return metadata for a single scenario including its models and datasets."""
    return repository.get_scenario(uuid)


@scenario_router.get(
    "/{uuid}/state", response_model=DatasetWithData, summary="Get scenario dataset state"
)
def get_scenario_state(
    uuid: str = Path(description="Scenario UUID"),
    timestamp: t.Optional[int] = Query(
        default=None, description="Simulation timestamp to retrieve state at"
    ),
    dataset_uuid: str = Depends(dependencies.dataset_uuid),
    repository: Repository = Depends(dependencies.repository),
):
    """Return the state of a dataset within a scenario at a given timestamp."""
    scenario = repository.get_scenario(uuid)
    if not scenario["has_timeline"]:
        raise NotFound("simulation", scenario)

    return repository.get_state(uuid, dataset_uuid, timestamp)


@scenario_router.get(
    "/{uuid}/updates", response_model=UpdateCollection, summary="List updates for a scenario"
)
def list_updates(
    uuid: str = Path(description="Scenario UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return all simulation updates available for a scenario."""
    return {"updates": repository.get_updates(uuid)}


@scenario_router.get(
    "/{uuid}/summary",
    response_model=DatasetSummary,
    summary="Get dataset summary within a scenario",
)
def get_dataset_summary(
    uuid: str = Path(description="Scenario UUID"),
    repository: Repository = Depends(dependencies.repository),
    dataset_uuid: str = Depends(dependencies.dataset_uuid),
):
    """Return summary statistics for a dataset in the context of a scenario."""
    return repository.get_scenario_summary(scenario_uuid=uuid, dataset_uuid=dataset_uuid)


@scenario_router.get(
    "/{uuid}/views", response_model=ViewCollection, summary="List views for a scenario"
)
def list_views(
    uuid: str = Path(description="Scenario UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return all saved visualization views for a scenario."""
    return {"views": repository.get_views(uuid)}


@scenario_router.post(
    "/{uuid}/views", response_model=ViewCrudResponse, summary="Create a view for a scenario"
)
def add_view(
    uuid: str = Path(description="Scenario UUID"),
    payload: InView = ...,
    repository: Repository = Depends(dependencies.repository),
):
    """Create a new visualization view for a scenario."""
    uuid = repository.add_view(uuid, payload)
    return {"result": "ok", "message": "view created", "view_uuid": uuid}
