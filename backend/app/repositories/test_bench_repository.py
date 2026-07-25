"""Data access layer for the BancTestBDD entity."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.test_bench import BancTestBDD


class TestBenchRepository:
    """Repository encapsulating database access for test benches."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_code(self, code_banc: str) -> BancTestBDD | None:
        """Return the test bench with the given code, or ``None``."""
        return self._db.get(BancTestBDD, code_banc)

    def create(self, banc_data: dict) -> BancTestBDD:
        """Create a new test bench."""
        banc = BancTestBDD(**banc_data)
        self._db.add(banc)
        self._db.commit()
        self._db.refresh(banc)
        return banc

    def update(self, code_banc: str, update_data: dict) -> BancTestBDD | None:
        """Update test bench fields partially."""
        banc = self.get_by_code(code_banc)
        if not banc:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(banc, key, value)

        self._db.commit()
        self._db.refresh(banc)
        return banc

    def delete(self, code_banc: str) -> bool:
        """Delete a test bench."""
        banc = self.get_by_code(code_banc)
        if not banc:
            return False

        self._db.delete(banc)
        self._db.commit()
        return True

    def list(self, skip: int = 0, limit: int = 100) -> list[BancTestBDD]:
        """Return paginated list of test benches."""
        stmt = select(BancTestBDD).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))
