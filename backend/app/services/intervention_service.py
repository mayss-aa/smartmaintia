"""Service layer for the Intervention entity."""

from datetime import datetime
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.enums import StatutBanc, StatutTicket, TypeIntervention
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.repositories.alerte_repository import AlerteRepository
from app.repositories.historique_repository import HistoriqueRepository
from app.repositories.intervention_repository import InterventionRepository
from app.repositories.ticket_repository import TicketRepository
from app.repositories.user_repository import UserRepository
from app.schemas.intervention import InterventionCompleteRequest, InterventionCreate, InterventionUpdate


class InterventionService:
    """Business logic for maintenance interventions."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self._intervention_repo = InterventionRepository(db)
        self._ticket_repo = TicketRepository(db)
        self._user_repo = UserRepository(db)
        self._alerte_repo = AlerteRepository(db)
        self._historique_repo = HistoriqueRepository(db)

    def list_interventions(
        self, skip: int = 0, limit: int = 100
    ) -> list[Intervention]:
        """Return paginated list of maintenance interventions."""
        return self._intervention_repo.list(skip, limit)

    def get_intervention(self, id_intervention: int) -> Intervention | None:
        """Return a maintenance intervention by its id, or None."""
        return self._intervention_repo.get_by_id(id_intervention)

    def create_intervention(self, intervention_create: InterventionCreate) -> Intervention:
        """Create a new maintenance intervention."""
        # Validation: ensure technicien exists and is TECHNICIEN
        technicien = self._user_repo.get_by_id(intervention_create.id_technicien)
        if not technicien:
            raise ValueError(
                f"Technician with id {intervention_create.id_technicien} does not exist"
            )
        if technicien.role.value != "TECHNICIEN":
            raise ValueError(
                f"User with id {intervention_create.id_technicien} is not a technician"
            )

        # Validation: ensure manager exists and is MANAGER_MAINTENANCE
        manager = self._user_repo.get_by_id(intervention_create.id_manager)
        if not manager:
            raise ValueError(
                f"Manager with id {intervention_create.id_manager} does not exist"
            )
        if manager.role.value != "MANAGER_MAINTENANCE":
            raise ValueError(
                f"User with id {intervention_create.id_manager} is not a manager"
            )

        # Validation: ensure ticket exists if provided
        if intervention_create.id_ticket:
            ticket = self._ticket_repo.get_by_id(intervention_create.id_ticket)
            if not ticket:
                raise ValueError(
                    f"Ticket with id {intervention_create.id_ticket} does not exist"
                )

        # Validation: ensure predictive alert exists if provided
        if intervention_create.id_alerte:
            alerte = self._alerte_repo.get(intervention_create.id_alerte)
            if not alerte:
                raise ValueError(
                    f"Predictive alert with id {intervention_create.id_alerte} does not exist"
                )

        # Validate type
        if not isinstance(intervention_create.type, TypeIntervention):
            raise ValueError(f"Invalid intervention type: {intervention_create.type}")

        intervention_data = intervention_create.model_dump()
        return self._intervention_repo.create(intervention_data)

    def update_intervention(
        self, id_intervention: int, intervention_update: InterventionUpdate
    ) -> Intervention | None:
        """Update a maintenance intervention partially."""
        # Validation: ensure intervention exists
        existing = self._intervention_repo.get_by_id(id_intervention)
        if not existing:
            return None

        # Validation: terminal states are immutable
        if existing.statut_intervention in ("Validée", "Rejetée"):
            raise ValueError(
                f"Cannot modify intervention {id_intervention}: "
                f"status '{existing.statut_intervention}' is final"
            )

        # Validate type if provided
        if intervention_update.type and not isinstance(intervention_update.type, TypeIntervention):
            raise ValueError(f"Invalid intervention type: {intervention_update.type}")

        # Validate technicien if provided
        if intervention_update.id_technicien:
            technicien = self._user_repo.get_by_id(intervention_update.id_technicien)
            if not technicien:
                raise ValueError(
                    f"Technician with id {intervention_update.id_technicien} does not exist"
                )
            if technicien.role.value != "TECHNICIEN":
                raise ValueError(
                    f"User with id {intervention_update.id_technicien} is not a technician"
                )

        # Validate manager if provided
        if intervention_update.id_manager:
            manager = self._user_repo.get_by_id(intervention_update.id_manager)
            if not manager:
                raise ValueError(
                    f"Manager with id {intervention_update.id_manager} does not exist"
                )
            if manager.role.value != "MANAGER_MAINTENANCE":
                raise ValueError(
                    f"User with id {intervention_update.id_manager} is not a manager"
                )

        # Validate ticket if provided
        if intervention_update.id_ticket:
            ticket = self._ticket_repo.get_by_id(intervention_update.id_ticket)
            if not ticket:
                raise ValueError(
                    f"Ticket with id {intervention_update.id_ticket} does not exist"
                )

        update_data = {
            k: v for k, v in intervention_update.model_dump().items() if v is not None
        }
        updated = self._intervention_repo.update(id_intervention, update_data)

        if intervention_update.statut_intervention == "Validée" and updated and updated.ticket:
            self._ticket_repo.update(updated.ticket.id_ticket, {"statut": StatutTicket.CLOTURE})

        return updated

    def delete_intervention(self, id_intervention: int) -> bool:
        """Delete a maintenance intervention."""
        return self._intervention_repo.delete(id_intervention)

    def list_interventions_by_technicien(
        self, id_technicien: int, skip: int = 0, limit: int = 100
    ) -> list[Intervention]:
        """Return paginated list of interventions for a specific technician."""
        # Validation: ensure technicien exists
        technicien = self._user_repo.get_by_id(id_technicien)
        if not technicien:
            raise ValueError(f"Technician with id {id_technicien} does not exist")

        return self._intervention_repo.list_by_technicien(id_technicien, skip, limit)

    def list_interventions_by_manager(
        self, id_manager: int, skip: int = 0, limit: int = 100
    ) -> list[Intervention]:
        """Return paginated list of interventions for a specific manager."""
        # Validation: ensure manager exists
        manager = self._user_repo.get_by_id(id_manager)
        if not manager:
            raise ValueError(f"Manager with id {id_manager} does not exist")

        return self._intervention_repo.list_by_manager(id_manager, skip, limit)

    def list_interventions_by_ticket(
        self, id_ticket: int, skip: int = 0, limit: int = 100
    ) -> list[Intervention]:
        """Return paginated list of interventions for a specific ticket."""
        # Validation: ensure ticket exists
        ticket = self._ticket_repo.get_by_id(id_ticket)
        if not ticket:
            raise ValueError(f"Ticket with id {id_ticket} does not exist")

        return self._intervention_repo.list_by_ticket(id_ticket, skip, limit)

    def start_intervention(self, id_intervention: int, id_technicien: int) -> Intervention:
        intervention = self._intervention_repo.get_by_id(id_intervention)
        if not intervention:
            raise ValueError(f"Intervention with id {id_intervention} not found")
        if intervention.id_technicien != id_technicien:
            raise ValueError("Intervention not assigned to this technician")
        if intervention.statut_intervention != "Planifiée":
            raise ValueError("Only planned interventions can be started")

        intervention.statut_intervention = "En cours"
        banc: BancTestBDD = self.db.get(BancTestBDD, intervention.ticket.code_banc)
        banc.statut = StatutBanc.EN_MAINTENANCE
        self.db.commit()
        self.db.refresh(intervention)
        return intervention

    def complete_intervention(
        self, id_intervention: int, id_technicien: int, request: InterventionCompleteRequest
    ) -> Intervention:
        intervention = self._intervention_repo.get_by_id(id_intervention)
        if not intervention:
            raise ValueError(f"Intervention with id {id_intervention} not found")
        if intervention.id_technicien != id_technicien:
            raise ValueError("Intervention not assigned to this technician")
        if intervention.statut_intervention != "En cours":
            raise ValueError("Only in-progress interventions can be completed")

        if not intervention.ticket:
            raise ValueError("Intervention has no associated ticket")

        parts = []
        if request.rapport:
            parts.append(f"Rapport: {request.rapport}")
        if request.actions_realisees:
            parts.append(f"Actions réalisées: {request.actions_realisees}")
        if request.commentaire:
            parts.append(f"Commentaire: {request.commentaire}")
        rapport_clean_ia = "\n".join(parts) if parts else ""

        now = datetime.utcnow()
        historique_data = {
            "code_banc": intervention.ticket.code_banc,
            "id_intervention": id_intervention,
            "type_action": "Intervention",
            "rapport_clean_ia": rapport_clean_ia,
            "date_cloture": now,
            "mttr_calcule": intervention.duree_reparation,
        }
        self._historique_repo.create(historique_data)

        intervention.statut_intervention = "Terminée"
        banc: BancTestBDD = self.db.get(BancTestBDD, intervention.ticket.code_banc)
        banc.statut = StatutBanc.OPERATIONNEL
        self.db.commit()
        self.db.refresh(intervention)
        return intervention


def get_intervention_service(
    db: Annotated[Session, Depends(get_db)],
) -> InterventionService:
    """Dependency for obtaining an InterventionService instance."""
    return InterventionService(db)