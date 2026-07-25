"""Repository for planning operations.

The planning is derived from Intervention records that have `date_planifiee` 
and `id_technicien` (see DATABASE.md). This repository provides specific queries
for planning operations.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session, joinedload

from app.models.enums import InterventionStatus, TypeIntervention
from app.models.intervention import Intervention
from app.models.ticket import TicketMaintenance


class PlanningRepository:
    """Repository for planning-related database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_planned_interventions(
        self,
        skip: int = 0,
        limit: int = 100,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
        id_technicien: Optional[int] = None,
        type_intervention: Optional[TypeIntervention] = None,
        statut_intervention: Optional[str] = None,
    ) -> list[Intervention]:
        """Get planned interventions with filtering options.
        
        Only returns interventions that have a planned date and a technician assigned.
        """
        query = self.db.query(Intervention).options(
            joinedload(Intervention.technicien),
            joinedload(Intervention.manager),
            joinedload(Intervention.ticket).joinedload(TicketMaintenance.banc)
        )
        
        # Base filter: must have date_planifiee and id_technicien
        query = query.filter(
            Intervention.date_planifiee.isnot(None),
            Intervention.id_technicien.isnot(None)
        )
        
        # Apply filters
        if date_debut:
            query = query.filter(Intervention.date_planifiee >= date_debut)
        if date_fin:
            query = query.filter(Intervention.date_planifiee <= date_fin)
        if id_technicien:
            query = query.filter(Intervention.id_technicien == id_technicien)
        if type_intervention:
            query = query.filter(Intervention.type == type_intervention)
        if statut_intervention:
            query = query.filter(Intervention.statut_intervention == statut_intervention)
        
        # Order by planned date
        query = query.order_by(Intervention.date_planifiee)
        
        return query.offset(skip).limit(limit).all()
    
    def get_technicien_planning(
        self,
        id_technicien: int,
        skip: int = 0,
        limit: int = 100,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
    ) -> list[Intervention]:
        """Get planning for a specific technician."""
        query = self.db.query(Intervention).options(
            joinedload(Intervention.technicien),
            joinedload(Intervention.manager),
            joinedload(Intervention.ticket).joinedload(TicketMaintenance.banc)
        ).filter(
            Intervention.id_technicien == id_technicien,
            Intervention.date_planifiee.isnot(None)
        )
        
        if date_debut:
            query = query.filter(Intervention.date_planifiee >= date_debut)
        if date_fin:
            query = query.filter(Intervention.date_planifiee <= date_fin)
        
        query = query.order_by(Intervention.date_planifiee)
        
        return query.offset(skip).limit(limit).all()
    
    def get_planning_by_date_range(
        self,
        date_debut: datetime,
        date_fin: datetime,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Intervention]:
        """Get planning entries within a specific date range."""
        return self.get_planned_interventions(
            skip=skip,
            limit=limit,
            date_debut=date_debut,
            date_fin=date_fin
        )
    
    def get_intervention_by_id(
        self,
        id_intervention: int,
    ) -> Optional[Intervention]:
        """Get a specific intervention by ID with related data."""
        return self.db.query(Intervention).options(
            joinedload(Intervention.technicien),
            joinedload(Intervention.manager),
            joinedload(Intervention.ticket).joinedload(TicketMaintenance.banc)
        ).filter(Intervention.id_intervention == id_intervention).first()
    
    def check_technicien_availability(
        self,
        id_technicien: int,
        date_debut: datetime,
        date_fin: datetime,
        exclude_intervention_id: Optional[int] = None,
    ) -> bool:
        """Check if a technician is available during a time period.
        
        Returns True if technician has no planned interventions in the given period
        (excluding the specified intervention if provided).
        """
        query = self.db.query(Intervention).filter(
            Intervention.id_technicien == id_technicien,
            Intervention.date_planifiee.isnot(None),
            Intervention.statut_intervention.in_([InterventionStatus.PLANIFIEE, InterventionStatus.EN_COURS]),
            or_(
                # Overlap conditions
                and_(
                    Intervention.date_planifiee <= date_fin,
                    Intervention.date_planifiee >= date_debut
                ),
                # Intervention that starts before but ends during our period
                and_(
                    Intervention.date_planifiee <= date_debut,
                    Intervention.date_planifiee + Intervention.duree_reparation >= date_debut
                ) if Intervention.duree_reparation is not None else False
            )
        )
        
        if exclude_intervention_id:
            query = query.filter(Intervention.id_intervention != exclude_intervention_id)
        
        conflicting_interventions = query.count()
        return conflicting_interventions == 0
    
    def count_planned_interventions_by_technicien(
        self,
        id_technicien: int,
        date_debut: Optional[datetime] = None,
        date_fin: Optional[datetime] = None,
    ) -> int:
        """Count planned interventions for a technician within a date range."""
        query = self.db.query(Intervention).filter(
            Intervention.id_technicien == id_technicien,
            Intervention.date_planifiee.isnot(None),
            Intervention.statut_intervention == InterventionStatus.PLANIFIEE
        )
        
        if date_debut:
            query = query.filter(Intervention.date_planifiee >= date_debut)
        if date_fin:
            query = query.filter(Intervention.date_planifiee <= date_fin)
        
        return query.count()
