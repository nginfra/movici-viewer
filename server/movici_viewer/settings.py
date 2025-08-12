from enum import Enum

from pydantic import DirectoryPath
from pydantic_settings import BaseSettings


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LogFormat(str, Enum):
    TEXT = "text"
    JSON = "json"


class Settings(BaseSettings):
    DATA_DIR: DirectoryPath | None = None
    USE_GLOBAL_PLUGINS: bool = True
    VALIDATE_UPDATES: bool = False

    # Logging configuration
    LOG_LEVEL: LogLevel = LogLevel.INFO
    LOG_FORMAT: LogFormat = LogFormat.TEXT
    LOG_FILE: str | None = None

    # Performance configuration
    WORKERS: int = 1
    MAX_CONNECTIONS: int = 1000
    KEEPALIVE_TIMEOUT: int = 5

    # Security configuration
    CORS_ORIGINS: list[str] = ["*"]
    API_RATE_LIMIT: int = 100

    # Monitoring configuration
    ENABLE_METRICS: bool = False
    METRICS_PORT: int = 9090

    model_config = {"env_prefix": "MOVICI_FLOW_"}
