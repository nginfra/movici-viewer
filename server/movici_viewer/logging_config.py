import json
import logging
import logging.config
import sys
from datetime import datetime

from .settings import LogFormat, Settings


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields
        for key, value in record.__dict__.items():
            if key not in {
                "name",
                "msg",
                "args",
                "levelname",
                "levelno",
                "pathname",
                "filename",
                "module",
                "lineno",
                "funcName",
                "created",
                "msecs",
                "relativeCreated",
                "thread",
                "threadName",
                "processName",
                "process",
                "getMessage",
                "exc_info",
                "exc_text",
                "stack_info",
            }:
                log_data[key] = value

        return json.dumps(log_data, default=str)


def setup_logging(settings: Settings) -> None:
    """Configure application logging based on settings."""

    # Determine formatter
    if settings.LOG_FORMAT == LogFormat.JSON:
        formatter_class = JSONFormatter
        formatter_config = {}
    else:
        formatter_class = logging.Formatter
        formatter_config = {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }

    # Configure handlers
    handlers = {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "default",
            "level": settings.LOG_LEVEL.value,
        }
    }

    # Add file handler if specified
    if settings.LOG_FILE:
        handlers["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": settings.LOG_FILE,
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "formatter": "default",
            "level": settings.LOG_LEVEL.value,
        }

    # Logging configuration
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {"default": {"()": formatter_class, **formatter_config}},
        "handlers": handlers,
        "root": {
            "level": settings.LOG_LEVEL.value,
            "handlers": list(handlers.keys()),
        },
        "loggers": {
            "movici_viewer": {
                "level": settings.LOG_LEVEL.value,
                "handlers": list(handlers.keys()),
                "propagate": False,
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": list(handlers.keys()),
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": list(handlers.keys()),
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(config)
