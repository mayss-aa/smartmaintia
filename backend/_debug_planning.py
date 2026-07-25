"""Temporary debug script to reproduce the planning 500 error with full traceback."""

import traceback

from app.database.session import SessionLocal
from app.repositories.planning_repository import PlanningRepository

db = SessionLocal()
try:
    repo = PlanningRepository(db)
    interventions = repo.get_planned_interventions()
    print("SUCCESS:", len(interventions))
except Exception:
    traceback.print_exc()
finally:
    db.close()
