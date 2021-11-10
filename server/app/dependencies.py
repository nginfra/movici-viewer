from functools import lru_cache

from fastapi import Depends

from server.app.model.model import Repository
from server.app.settings import Settings


@lru_cache()
def get_settings():
    return Settings()


def repository(settings: Settings = Depends(get_settings)):
    return Repository(settings.DATA_DIR, use_global_plugins=settings.USE_GLOBAL_PLUGINS)