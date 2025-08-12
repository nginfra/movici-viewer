from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ServerError(Exception):
    status_code = 500
    pass


class NotFound(ServerError):
    status_code = 404

    def __init__(self, kind, name):
        self.kind = kind
        self.name = name

    def __str__(self):
        return f"{self.kind} '{self.name}' not found"


class InvalidObject(ServerError):
    status_code = 400

    def __init__(self, kind: str, name: str, exception: Exception | None):
        self.kind = kind
        self.name = name
        self.exc = exception

    def __str__(self):
        return f"Error while reading {self.kind} '{self.name}'"


class Conflict(ServerError):
    status_code = 409

    def __init__(self, kind, name):
        self.kind = kind
        self.name = name

    def __str__(self):
        return f"{self.kind} '{self.name}' already exists"


def add_exception_handling(app: FastAPI):
    app.add_exception_handler(ServerError, format_server_error)
    app.add_exception_handler(HTTPException, format_http_exception)
    app.add_exception_handler(RequestValidationError, format_request_validation_exception)


def format_server_error(_: Request, exception: ServerError):
    return JSONResponse(
        status_code=exception.status_code,
        content={"message": str(exception)},
    )


def format_http_exception(_: Request, exception: HTTPException):
    return JSONResponse(
        status_code=exception.status_code,
        content={"message": exception.detail},
        headers=exception.headers,
    )


def format_request_validation_exception(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"message": jsonable_encoder(exc.errors())},
    )
