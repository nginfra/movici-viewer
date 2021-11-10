import typing as t


class ServerError(Exception):
    pass


class NotFound(ServerError):
    def __init__(self, kind, name):
        self.kind = kind
        self.name = name

    def __str__(self):
        return f"{self.kind} '{self.name}' not found"


class InvalidObject(ServerError):
    def __init__(self, kind: str, name: str, exception: t.Optional[Exception]):
        self.kind = kind
        self.name = name
        self.exc = exception

    def __str__(self):
        return f"Error while reading {self.kind} '{self.name}'"
