"""Business enumerations defined in ERD.md.

Only ``RoleUtilisateur`` is required by the authentication module. Other
enumerations (StatutBanc, StatutTicket, TypeIntervention) will be added when
their entities are implemented.
"""

import enum


class RoleUtilisateur(str, enum.Enum):
    """User roles as defined in ERD.md."""

    ADMINISTRATEUR = "ADMINISTRATEUR"
    MANAGER_MAINTENANCE = "MANAGER_MAINTENANCE"
    TECHNICIEN = "TECHNICIEN"
    OPERATEUR_PRODUCTION = "OPERATEUR_PRODUCTION"


class StatutBanc(str, enum.Enum):
    """Test bench status as defined in ERD.md."""

    OPERATIONNEL = "OPERATIONNEL"
    EN_PANNE = "EN_PANNE"
    EN_MAINTENANCE = "EN_MAINTENANCE"


class StatutTicket(str, enum.Enum):
    """Ticket status as defined in ERD.md."""

    OUVERT = "OUVERT"
    EN_COURS = "EN_COURS"
    CLOTURE = "CLOTURE"


class TypeIntervention(str, enum.Enum):
    """Intervention type as defined in ERD.md."""

    CURATIF = "CURATIF"
    PREVENTIF = "PREVENTIF"
    PREDICTIF = "PREDICTIF"


class PrioriteIntervention(str, enum.Enum):
    """Priority level for maintenance interventions.

    Values are coordinated with the frontend "Priorité" selector
    (NewIntervention.tsx) and the Planning priority column.
    """

    BASSE = "BASSE"
    MOYENNE = "MOYENNE"
    HAUTE = "HAUTE"
    CRITIQUE = "CRITIQUE"


class InterventionStatus:
    """Centralized intervention status values (not a database enum).

    ``statut_intervention`` is a plain ``String(50)`` column. These
    constants prevent scattering string literals across the codebase.
    """

    PLANIFIEE = "Planifiée"
    EN_COURS = "En cours"
    TERMINEE = "Terminée"
    VALIDEE = "Validée"
    REJETEE = "Rejetée"
