from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from ..model.model import Repository
from ..schemas.dataset import DatasetCollection, Dataset
from .. import dependencies
from ..schemas.summary import DatasetSummary

dataset_router = APIRouter(prefix="/datasets")


@dataset_router.get("/", response_model=DatasetCollection)
def list_datasets(repository: Repository = Depends(dependencies.repository)):
    return {"datasets": repository.get_datasets()}


@dataset_router.get("/{uuid}", response_model=Dataset)
def get_dataset(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return repository.get_dataset(uuid)


@dataset_router.get("/{uuid}/data")
def get_dataset_data(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return FileResponse(repository.get_dataset_data(uuid))


@dataset_router.get("/{uuid}/summary", response_model=DatasetSummary)
def get_dataset_summary(uuid: str, repository: Repository = Depends(dependencies.repository)):
    return repository.get_dataset_summary(uuid)
