import dataclasses
import enum
from pathlib import Path


class DatasetFormat(enum.Enum):
    ENTITY_BASED = "entity_based"
    UNSTRUCTURED = "unstructured"
    BINARY = "binary"


@dataclasses.dataclass
class InitDataInfo:
    name: str
    path: Path
    format: DatasetFormat

