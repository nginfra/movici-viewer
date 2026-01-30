import typing as t

from pydantic import DirectoryPath
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATA_DIR: t.Optional[DirectoryPath] = None
    USE_GLOBAL_PLUGINS: bool = True
    VALIDATE_UPDATES: bool = False
    ALLOW_CORS: bool = False

    class Config:
        env_prefix = "MOVICI_FLOW_"
