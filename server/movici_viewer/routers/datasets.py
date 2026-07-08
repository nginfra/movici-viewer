from fastapi import APIRouter, Depends, Path
from fastapi.responses import FileResponse

from .. import dependencies
from ..model.model import Repository
from ..schemas.dataset import Dataset, DatasetCollection
from ..schemas.summary import DatasetSummary

dataset_router = APIRouter(prefix="/datasets", tags=["Datasets"])


@dataset_router.get("/", response_model=DatasetCollection, summary="List all datasets")
def list_datasets(repository: Repository = Depends(dependencies.repository)):
    """Return all datasets available in the simulation data directory."""
    return {"datasets": repository.get_datasets()}


@dataset_router.get("/{uuid}", response_model=Dataset, summary="Get a dataset by UUID")
def get_dataset(
    uuid: str = Path(description="Dataset UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return metadata for a single dataset."""
    return repository.get_dataset(uuid)


@dataset_router.get("/{uuid}/data", summary="Download dataset file")
def get_dataset_data(
    uuid: str = Path(description="Dataset UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return the raw dataset data file."""
    return FileResponse(repository.get_dataset_data(uuid))


@dataset_router.get(
    "/{uuid}/summary", response_model=DatasetSummary, summary="Get dataset summary"
)
def get_dataset_summary(
    uuid: str = Path(description="Dataset UUID"),
    repository: Repository = Depends(dependencies.repository),
):
    """Return summary statistics for a dataset, including entity groups and property ranges."""
    return repository.get_dataset_summary(uuid)
