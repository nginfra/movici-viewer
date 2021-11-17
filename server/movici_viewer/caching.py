from functools import lru_cache, partial

_cached_functions = []


def memoize(func=None, **kwargs):
    if func is None:
        return partial(memoize, **kwargs)
    cached = lru_cache(**kwargs)(func)
    _cached_functions.append(cached)
    return cached


def cache_clear():
    for func in _cached_functions:
        func.cache_clear()
