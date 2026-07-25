"""Service layer for the BancTestBDD entity."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.enums import StatutBanc
from app.models.test_bench import BancTestBDD
from app.repositories.test_bench_repository import TestBenchRepository
from app.schemas.test_bench import BancTestBDDCreate, BancTestBDDUpdate


class TestBenchService:
    """Business logic for test benches."""

    def __init__(self, db: Session) -> None:
        self._repo = TestBenchRepository(db)

    def list_bancs(
        self, skip: int = 0, limit: int = 100
    ) -> list[BancTestBDD]:
        """Return paginated list of test benches."""
        return self._repo.list(skip, limit)

    def get_banc(self, code_banc: str) -> BancTestBDD | None:
        """Return a test bench by its code, or None."""
        return self._repo.get_by_code(code_banc)

    def create_banc(self, banc_create: BancTestBDDCreate) -> BancTestBDD:
        """Create a new test bench."""
        # Validation: ensure banc doesn't already exist
        existing = self._repo.get_by_code(banc_create.code_banc)
        if existing:
            raise ValueError(
                f"Test bench with code {banc_create.code_banc} already exists"
            )

        # Validate status
        if not isinstance(banc_create.statut, StatutBanc):
            raise ValueError(f"Invalid status: {banc_create.statut}")

        banc_data = banc_create.model_dump()
        return self._repo.create(banc_data)

    def update_banc(
        self, code_banc: str, banc_update: BancTestBDDUpdate
    ) -> BancTestBDD | None:
        """Update a test bench partially."""
        # Validation: ensure banc exists
        existing = self._repo.get_by_code(code_banc)
        if not existing:
            return None

        # Validate status if provided
        if banc_update.statut and not isinstance(banc_update.statut, StatutBanc):
            raise ValueError(f"Invalid status: {banc_update.statut}")

        update_data = {
            k: v for k, v in banc_update.model_dump().items() if v is not None
        }
        return self._repo.update(code_banc, update_data)

    def delete_banc(self, code_banc: str) -> bool:
        """Delete a test bench."""
        return self._repo.delete(code_banc)


def get_test_bench_service(
    db: Annotated[Session, Depends(get_db)],
) -> TestBenchService:
    """Dependency for obtaining a TestBenchService instance."""
    return TestBenchService(db)
