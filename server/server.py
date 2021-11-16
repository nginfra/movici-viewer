#! /usr/bin/env python3
import click
import uvicorn

from app.main import get_app
from app.settings import Settings


@click.command()
@click.option("-d", "--directory", default="/home/pellekoster/develop/experiments/local-flow/server/tests/data")
def main(directory):
    settings = Settings(DATA_DIR=directory)
    app = get_app(settings)
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")


if __name__ == "__main__":
    main()
