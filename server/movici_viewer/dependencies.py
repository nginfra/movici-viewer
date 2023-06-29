import typing as t
from functools import lru_cache

from fastapi import Depends, HTTPException
from movici_simulation_core import AttributeSchema

from .model.model import Repository
from .settings import Settings


@lru_cache()
def get_settings():
    return Settings()


def attributes():
    return AttributeSchema()


def repository(
    settings: Settings = Depends(get_settings), attributes: Settings = Depends(attributes)
):
    return Repository(
        settings.DATA_DIR, attributes=attributes, use_global_plugins=settings.USE_GLOBAL_PLUGINS
    )


def dataset_uuid(dataset_name: t.Optional[str] = None, dataset_uuid: t.Optional[str] = None):
    if not (bool(dataset_uuid) ^ bool(dataset_name)):
        raise HTTPException(400, "supply either dataset_uuid or dataset_name")
    return dataset_uuid or dataset_name
