"""Service layer for planning operations."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.enums import InterventionStatus, TypeIntervention
from app.models.intervention import Intervention
from app.repositories.intervention_repository import InterventionRepository
from app.repositories.planning_repository import PlanningRepository
from app.repositories.user_repository import UserRepository
from app.schemas.planning import PlanningUpdate


class PlanningService:
    """Service for planning business logic."""
    
    def __init__(self, db: Session):
        self.db = db
        self.planning_repo = PlanningRepository(db)
        self.intervention_repo = InterventionRepository(db)
        self.user_repo = UserRepository(db)
    
    def get_planning(
        self,
        skip: int = 0,
        limit: int = 100,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
        id_technicien: Optional[int] = None,
        type_intervention: Optional[TypeIntervention] = None,
        statut_intervention: Optional[str] = None,
    ) -> list[Intervention]:
        """Get planning entries with filtering."""
        return self.planning_repo.get_planned_interventions(
            skip=skip,
            limit=limit,
            date_debut=date_debut,
            date_fin=date_fin,
            id_technicien=id_technicien,
            type_intervention=type_intervention,
            statut_intervention=statut_intervention
        )
    
    def get_technicien_planning(
        self,
        id_technicien: int,
        skip: int = 0,
        limit: int = 100,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
    ) -> list[Intervention]:
        """Get planning for a specific technician."""
        # Verify technician exists and has TECHNICIEN role
        technicien = self.user_repo.get_by_id(id_technicien)
        if not technicien:
            raise ValueError(f"Technician with ID {id_technicien} not found")
        
        return self.planning_repo.get_technicien_planning(
            id_technicien=id_technicien,
            skip=skip,
            limit=limit,
            date_debut=date_debut,
            date_fin=date_fin
        )
    
    def update_planning_entry(
        self,
        id_intervention: int,
        update_data: PlanningUpdate,
    ) -> Optional[Intervention]:
        """Update a planning entry (planned intervention)."""
        # Get existing intervention
        intervention = self.planning_repo.get_intervention_by_id(id_intervention)
        if not intervention:
            return None
        
        # Check if it's a planning entry (has date_planifiee and id_technicien)
        if not intervention.date_planifiee or not intervention.id_technicien:
            raise ValueError(f"Intervention {id_intervention} is not a planning entry")
        
        # Terminal state guard: Planning must not modify validated/rejected interventions
        if intervention.statut_intervention in (InterventionStatus.VALIDEE, InterventionStatus.REJETEE):
            raise ValueError(
                f"Cannot modify intervention {id_intervention}: "
                f"status '{intervention.statut_intervention}' is final"
            )
        
        # If changing technician or date, check availability
        if update_data.id_technicien is not None or update_data.date_planifiee is not None:
            new_technicien_id = update_data.id_technicien or intervention.id_technicien
            new_date_planifiee = update_data.date_planifiee or intervention.date_planifiee
            
            # Validate new technician exists
            if new_technicien_id != intervention.id_technicien:
                new_technicien = self.user_repo.get_by_id(new_technicien_id)
                if not new_technicien:
                    raise ValueError(f"Technician with ID {new_technicien_id} not found")
            
            # Check availability
            duree = update_data.duree_reparation or intervention.duree_reparation or 60
            date_fin = new_date_planifiee + timedelta(minutes=duree)
            
            is_available = self.planning_repo.check_technicien_availability(
                id_technicien=new_technicien_id,
                date_debut=new_date_planifiee,
                date_fin=date_fin,
                exclude_intervention_id=id_intervention
            )
            
            if not is_available:
                raise ValueError(
                    f"Technician {new_technicien_id} is not available "
                    f"at {new_date_planifiee}"
                )
        
        # Update intervention
        update_dict = update_data.model_dump(exclude_unset=True)
        updated_intervention = self.intervention_repo.update(
            id_intervention, update_dict
        )
        
        if updated_intervention:
            self.db.commit()
            self.db.refresh(updated_intervention)
        
        return updated_intervention
    
    def get_planning_entry(self, id_intervention: int) -> Optional[Intervention]:
        """Get a specific planning entry."""
        intervention = self.planning_repo.get_intervention_by_id(id_intervention)
        
        # Check if it's a planning entry
        if intervention and intervention.date_planifiee and intervention.id_technicien:
            return intervention
        return None
    
    def delete_planning_entry(self, id_intervention: int) -> bool:
        """Delete a planning entry."""
        # Get intervention to check if it's a planning entry
        intervention = self.planning_repo.get_intervention_by_id(id_intervention)
        if not intervention or not intervention.date_planifiee or not intervention.id_technicien:
            return False
        
        success = self.intervention_repo.delete(id_intervention)
        if success:
            self.db.commit()
        return success
    
    def get_technicien_workload(
        self,
        id_technicien: int,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
    ) -> dict:
        """Get workload statistics for a technician."""
        # Default to next 7 days if no range specified
        if not date_debut:
            date_debut = datetime.now()
        if not date_fin:
            date_fin = date_debut + timedelta(days=7)
        
        planned_count = self.planning_repo.count_planned_interventions_by_technicien(
            id_technicien=id_technicien,
            date_debut=date_debut,
            date_fin=date_fin
        )
        
        interventions = self.planning_repo.get_technicien_planning(
            id_technicien=id_technicien,
            date_debut=date_debut,
            date_fin=date_fin
        )
        
        total_duration = 0
        by_type = {}
        
        for intervention in interventions:
            duration = intervention.duree_reparation or 60
            total_duration += duration
            
            intervention_type = intervention.type.value
            if intervention_type not in by_type:
                by_type[intervention_type] = 0
            by_type[intervention_type] += 1
        
        return {
            "technicien_id": id_technicien,
            "date_debut": date_debut,
            "date_fin": date_fin,
            "planned_count": planned_count,
            "total_duration_minutes": total_duration,
            "interventions_by_type": by_type,
            "avg_daily_interventions": planned_count / max((date_fin - date_debut).days, 1)
        }


def get_planning_service(db: Session = Depends(get_db)) -> PlanningService:
    """Dependency injection for PlanningService."""
    return PlanningService(db)
