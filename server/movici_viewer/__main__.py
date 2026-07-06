import sys

import click
import uvicorn

from .main import get_app
from .settings import Settings


@click.command()
@click.argument("directory")
@click.option("--host", "-h", default="localhost")
@click.option("--port", "-p", default=5000)
@click.option("--allow-cors", is_flag=True, default=False)
def main(directory, host, port, allow_cors):
    settings = Settings(DATA_DIR=directory, ALLOW_CORS=allow_cors)
    app = get_app(settings)
    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    sys.exit(main())
