from fastapi import APIRouter, Depends

from ..model.model import Repository
from ..schemas.dataset import DatasetCollection, Dataset
from .. import dependencies

dataset_router = APIRouter(prefix="/datasets")


@dataset_router.get("/", response_model=DatasetCollection)
def list_datasets(repository: Repository = Depends(dependencies.repository)):
    return {"datasets": repository.get_datasets()}


@dataset_router.get("/{uuid}", response_model=Dataset)
def get_dataset(
    uuid: str, repository: Repository = Depends(dependencies.repository)
):
    return repository.get_dataset(uuid)
