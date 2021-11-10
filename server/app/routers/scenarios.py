from fastapi import APIRouter, Depends

from ..model.model import Repository
from ..schemas.scenario import ScenarioCollection, Scenario
from .. import dependencies

scenario_router = APIRouter(prefix="/scenarios")


@scenario_router.get("/", response_model=ScenarioCollection)
def list_scenarios(repository: Repository = Depends(dependencies.repository)):
    return {"scenarios": repository.get_scenarios()}


@scenario_router.get("/{uuid}", response_model=Scenario)
def get_scenario(
    uuid: str, repository: Repository = Depends(dependencies.repository)
):
    return repository.get_scenario(uuid)
