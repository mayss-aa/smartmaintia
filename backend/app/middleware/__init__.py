"""Application middlewares registration."""

import time

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.core.logging import get_logger

logger = get_logger("app.request")


def register_middlewares(app: FastAPI) -> None:
    """Register cross-cutting middlewares (request logging, error handling)."""

    @app.middleware("http")
    async def log_and_guard(request: Request, call_next) -> Response:
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:  # noqa: BLE001 - centralized safety net
            duration_ms = (time.perf_counter() - start) * 1000
            logger.exception(
                "%s %s -> unhandled error (%.2f ms)",
                request.method,
                request.url.path,
                duration_ms,
            )
            return JSONResponse(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Internal server error"},
            )
        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "%s %s -> %s (%.2f ms)",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
