"""Models package.

Models are imported here so they are registered on ``Base.metadata`` for
Alembic autogeneration.
"""

from app.database.session import Base
from app.models.alerte import AlertePredictive
from app.models.enums import RoleUtilisateur, StatutBanc, StatutTicket, TypeIntervention
from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur

__all__ = [
    "Base",
    "AlertePredictive",
    "RoleUtilisateur",
    "StatutBanc",
    "StatutTicket",
    "TypeIntervention",
    "Utilisateur",
    "BancTestBDD",
    "TicketMaintenance",
    "Intervention",
    "HistoriqueGlobal",
]
