"""REST endpoints for BancTestBDD entity."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import (
    require_consultation_access_banc_test,
    require_full_access_banc_test,
)
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.test_bench import (
    BancTestBDDCreate,
    BancTestBDDRead,
    BancTestBDDUpdate,
)
from app.services.test_bench_service import (
    TestBenchService,
    get_test_bench_service,
)

router = APIRouter(prefix="/bancs", tags=["bancs"])


@router.get(
    "/",
    response_model=list[BancTestBDDRead],
    summary="List test benches",
    description="Return paginated list of test benches. All authenticated users can view.",
)
def list_bancs(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    service: TestBenchService = Depends(get_test_bench_service),
    current_user: Utilisateur = Depends(require_consultation_access_banc_test),
) -> list[BancTestBDDRead]:
    """List all test benches with pagination."""
    bancs = service.list_bancs(skip=skip, limit=limit)
    return [BancTestBDDRead.model_validate(banc) for banc in bancs]


@router.get(
    "/{code_banc}",
    response_model=BancTestBDDRead,
    summary="Get test bench by code",
    description="Return a specific test bench by its code. All authenticated users can view.",
)
def get_banc(
    code_banc: str,
    service: TestBenchService = Depends(get_test_bench_service),
    current_user: Utilisateur = Depends(require_consultation_access_banc_test),
) -> BancTestBDDRead:
    """Get a test bench by its code."""
    banc = service.get_banc(code_banc)
    if banc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test bench with code {code_banc} not found",
        )
    return BancTestBDDRead.model_validate(banc)


@router.post(
    "/",
    response_model=BancTestBDDRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create test bench",
    description="Create a new test bench. Only ADMINISTRATEUR can create.",
)
def create_banc(
    banc_create: BancTestBDDCreate,
    service: TestBenchService = Depends(get_test_bench_service),
    current_user: Utilisateur = Depends(require_full_access_banc_test),
) -> BancTestBDDRead:
    """Create a new test bench."""
    try:
        banc = service.create_banc(banc_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    return BancTestBDDRead.model_validate(banc)


@router.put(
    "/{code_banc}",
    response_model=BancTestBDDRead,
    summary="Update test bench",
    description="Update a test bench. Only ADMINISTRATEUR can update.",
)
def update_banc(
    code_banc: str,
    banc_update: BancTestBDDUpdate,
    service: TestBenchService = Depends(get_test_bench_service),
    current_user: Utilisateur = Depends(require_full_access_banc_test),
) -> BancTestBDDRead:
    """Update a test bench partially."""
    banc = service.update_banc(code_banc, banc_update)
    if banc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test bench with code {code_banc} not found",
        )
    return BancTestBDDRead.model_validate(banc)


@router.delete(
    "/{code_banc}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete test bench",
    description="Delete a test bench. Only ADMINISTRATEUR can delete.",
)
def delete_banc(
    code_banc: str,
    service: TestBenchService = Depends(get_test_bench_service),
    current_user: Utilisateur = Depends(require_full_access_banc_test),
) -> None:
    """Delete a test bench."""
    success = service.delete_banc(code_banc)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test bench with code {code_banc} not found",
        )
