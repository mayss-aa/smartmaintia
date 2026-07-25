"""FastAPI application entry point for SmartMaint IA (technical foundation).

Configures logging, CORS, middlewares, Swagger/OpenAPI documentation and the
versioned API router. No business feature is implemented at this stage.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config.settings import settings
from app.core.logging import configure_logging, get_logger
from app.middleware import register_middlewares

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: log startup and shutdown events."""
    logger.info(
        "Starting %s v%s (%s)",
        settings.APP_NAME,
        settings.APP_VERSION,
        settings.ENVIRONMENT,
    )
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


def create_app() -> FastAPI:
    """Application factory: build and configure the FastAPI instance."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Socle technique du backend SmartMaint IA.",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS - MUST BE FIRST middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middlewares (request logging + error safety net)
    register_middlewares(app)

    # Versioned API routes
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/", tags=["system"], summary="API root")
    def root() -> dict:
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "api_prefix": settings.API_V1_PREFIX,
        }

    return app


app = create_app()
