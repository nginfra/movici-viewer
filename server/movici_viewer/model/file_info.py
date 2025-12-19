import dataclasses
import enum
from pathlib import Path


class DatasetFormat(enum.Enum):
    ENTITY_BASED = "entity_based"
    UNSTRUCTURED = "unstructured"
    BINARY = "binary"


BINARY_DATASET_FILE_EXTENSIONS: dict[str | tuple[str, ...], str] = {
    ".nc": "flooding_tape",
    ".csv": "parameters",
    ".tiff": "heightmap",
    ".tif": "heightmap",
    ".geotiff": "heightmap",
}


@dataclasses.dataclass(frozen=True)
class InitDataInfo:
    name: str
    path: Path = dataclasses.field(compare=False)
    format: DatasetFormat | None = dataclasses.field(compare=False, default=None)
    type: str = dataclasses.field(compare=False, default="unknown")

    @classmethod
    def from_path(cls, path: Path):
        return cls(path.stem, path)

    def __post_init__(self):
        if self.path.suffix in BINARY_DATASET_FILE_EXTENSIONS:
            super().__setattr__("format", DatasetFormat.BINARY)
            if self.type == "unknown":
                super().__setattr__("type", BINARY_DATASET_FILE_EXTENSIONS[self.path.suffix])
