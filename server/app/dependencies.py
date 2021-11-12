import typing as t
from functools import lru_cache

from fastapi import Depends, HTTPException

from server.app.model.model import Repository
from server.app.settings import Settings
from server.app.types import UUID


@lru_cache()
def get_settings():
    return Settings()


def repository(settings: Settings = Depends(get_settings)):
    return Repository(settings.DATA_DIR, use_global_plugins=settings.USE_GLOBAL_PLUGINS)


def dataset_uuid(
    dataset_name: t.Optional[str] = None, dataset_uuid: t.Optional[UUID] = None
):
    if not (bool(dataset_uuid) ^ bool(dataset_name)):
        raise HTTPException(400, "supply either dataset_uuid or dataset_name")
    return dataset_uuid or dataset_name