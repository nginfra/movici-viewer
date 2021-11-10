from pydantic import BaseSettings, DirectoryPath
import typing as t


class Settings(BaseSettings):
    DATA_DIR: t.Optional[DirectoryPath] = None
    USE_GLOBAL_PLUGINS: bool = True

    class Config:
        env_prefix = "MOVICI_FLOW_"
