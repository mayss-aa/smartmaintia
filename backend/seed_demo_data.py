"""
Seed a complete realistic demonstration dataset. Fully idempotent.

If counts don't match targets, existing data is cleared and recreated.
User IDs are queried at runtime (never hardcoded beyond the 4 seeded users).
"""
import sys
from datetime import datetime, timedelta

from sqlalchemy import func, select, text

from app.database.session import SessionLocal
from app.models.alerte import AlertePredictive
from app.models.enums import (
    RoleUtilisateur, StatutBanc, StatutTicket,
    TypeIntervention, PrioriteIntervention, InterventionStatus,
)
from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur
from app.core.security import hash_password

# ── Data definitions ──────────────────────────────────────────────────

BENCHES = [
    BancTestBDD(code_banc="BANC-MOTEUR-01", nom="Moteur asynchrone 15kW",
                emplacement="Batiment A - Zone 1", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-HYDRAULIQUE-02", nom="Groupe hydraulique 200Bar",
                emplacement="Batiment A - Zone 2", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-ELECTRONIQUE-03", nom="Carte electronique de commande",
                emplacement="Batiment B - Zone 1", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-POMPE-04", nom="Pompe centrifuge multicellulaire",
                emplacement="Batiment B - Zone 2", statut=StatutBanc.EN_PANNE),
    BancTestBDD(code_banc="BANC-COMPRESSEUR-05", nom="Compresseur a vis 75kW",
                emplacement="Batiment C - Zone 1", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-TURBINE-06", nom="Turbine a gaz 2MW",
                emplacement="Batiment C - Zone 2", statut=StatutBanc.EN_MAINTENANCE),
    BancTestBDD(code_banc="BANC-ROBOT-07", nom="Robot bras articule 6 axes",
                emplacement="Batiment D - Zone 1", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-TRANSFO-08", nom="Transformateur HT/BT 2.5MVA",
                emplacement="Batiment D - Zone 2", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-CONVOYEUR-09", nom="Convoyeur a bande 50m",
                emplacement="Batiment E - Zone 1", statut=StatutBanc.OPERATIONNEL),
    BancTestBDD(code_banc="BANC-FOUR-10", nom="Four de traitement thermique",
                emplacement="Batiment E - Zone 2", statut=StatutBanc.EN_PANNE),
]

TICKETS = [
    ("BANC-MOTEUR-01", "Bruit anormal au demarrage - roulement cote accouplement", "HAUTE", 2),
    ("BANC-MOTEUR-01", "Vibration excessive mesuree a 12 mm/s sur palier avant", "CRITIQUE", 2),
    ("BANC-HYDRAULIQUE-02", "Fuite d'huile au niveau du verin de translation", "MOYENNE", 4),
    ("BANC-ELECTRONIQUE-03", "Carte I/O ne repond plus apres cycle de demarrage", "HAUTE", 4),
    ("BANC-POMPE-04", "Debit insuffisant - 35% sous le nominal", "HAUTE", 4),
    ("BANC-COMPRESSEUR-05", "Surchauffe de l'huile de lubrification (95C)", "MOYENNE", 4),
    ("BANC-TURBINE-06", "Alarme temperature echappement - capteur T1 defaillant", "HAUTE", 2),
    ("BANC-ROBOT-07", "Erreur d'axe 3 en boucle de position - derive detectee", "CRITIQUE", 4),
    ("BANC-TRANSFO-08", "Niveau d'huile bas dans le conservateur, fuite suspectee", "MOYENNE", 2),
    ("BANC-CONVOYEUR-09", "Rouleau porteur casse a la station de chargement", "BASSE", 4),
    ("BANC-FOUR-10", "Thermocouple T1 affiche valeurs aberrantes", "HAUTE", 4),
    ("BANC-HYDRAULIQUE-02", "Pression accumulateur inferieure au seuil de declenchement", "MOYENNE", 4),
    ("BANC-COMPRESSEUR-05", "Filtre a air colmate - pression differentielle 25mBar", "BASSE", 4),
    ("BANC-CONVOYEUR-09", "Tapis dechire sur 1.5m - arret production necessaire", "HAUTE", 2),
    ("BANC-ELECTRONIQUE-03", "Module WiFi industriel ne maintient pas la connexion", "BASSE", 4),
]

INTERVENTIONS = [
    (0, 0, TypeIntervention.CURATIF,   PrioriteIntervention.HAUTE,    InterventionStatus.TERMINEE,  -14, 90),
    (0, 0, TypeIntervention.PREVENTIF, PrioriteIntervention.CRITIQUE, InterventionStatus.TERMINEE,  -10, 120),
    (1, 0, TypeIntervention.CURATIF,   PrioriteIntervention.MOYENNE,  InterventionStatus.TERMINEE,  -7,  60),
    (2, 0, TypeIntervention.CURATIF,   PrioriteIntervention.HAUTE,    InterventionStatus.EN_COURS,  -1,  0),
    (1, 0, TypeIntervention.CURATIF,   PrioriteIntervention.HAUTE,    InterventionStatus.TERMINEE,  -5,  150),
    (0, 0, TypeIntervention.PREVENTIF, PrioriteIntervention.MOYENNE,  InterventionStatus.PLANIFIEE, 3,   45),
    (2, 0, TypeIntervention.PREDICTIF, PrioriteIntervention.HAUTE,    InterventionStatus.PLANIFIEE, 5,   0),
    (0, 0, TypeIntervention.CURATIF,   PrioriteIntervention.CRITIQUE, InterventionStatus.EN_COURS,  0,   0),
    (1, 0, TypeIntervention.PREVENTIF, PrioriteIntervention.MOYENNE,  InterventionStatus.PLANIFIEE, 7,   60),
    (0, 0, TypeIntervention.CURATIF,   PrioriteIntervention.BASSE,    InterventionStatus.TERMINEE,  -3,  30),
    (2, 0, TypeIntervention.CURATIF,   PrioriteIntervention.HAUTE,    InterventionStatus.PLANIFIEE, 10,  0),
    (1, 0, TypeIntervention.PREVENTIF, PrioriteIntervention.MOYENNE,  InterventionStatus.REJETEE,   -2,  0),
]
# tech_idx: 0=tech_a, 1=tech_b, 2=tech_c (filled at runtime from DB)

ALERTES = [
    ("BANC-MOTEUR-01", "Roulement avant",        0.78),
    ("BANC-HYDRAULIQUE-02", "Pompe hydraulique", 0.65),
    ("BANC-COMPRESSEUR-05", "Clapet anti-retour", 0.55),
    ("BANC-TURBINE-06", "Capteur temperature T1", 0.82),
    ("BANC-FOUR-10", "Thermocouple K-type",       0.71),
]

HISTORIQUES = {
    1: "Intervention curative - Roulement AV remplace. MTTR 90 min. Valeur vibration finale 1.2 mm/s.",
    2: "Intervention preventive - Inspection complete moteur. Aucun defaut detecte. Graissage effectue.",
    3: "Intervention curative - Joint verin remplace. Test pression 180 Bar OK.",
    5: "Intervention curative - Revision pompe centrifuge. Debit nominal retabli apres remplacement joints mecaniques.",
    10: "Intervention curative - Rouleau convoyeur remplace. Alignement bande et tension regles. Fonctionnement nominal.",
}

TARGET_BENCHES = 10
TARGET_TICKETS = 15
TARGET_INTERVENTIONS = 12
TARGET_HISTORIQUES = 5
TARGET_ALERTES = 5
TARGET_USERS = 6


def _needs_reset(db) -> bool:
    checks = [
        (BancTestBDD, TARGET_BENCHES),
        (TicketMaintenance, TARGET_TICKETS),
        (Intervention, TARGET_INTERVENTIONS),
        (HistoriqueGlobal, TARGET_HISTORIQUES),
        (AlertePredictive, TARGET_ALERTES),
    ]
    for model, target in checks:
        count = db.scalar(select(func.count()).select_from(model)) or 0
        if count != target:
            print(f"  {model.__tablename__}: {count} != {target} -> reset needed")
            return True
    user_count = db.scalar(select(func.count()).select_from(Utilisateur)) or 0
    if user_count != TARGET_USERS:
        print(f"  utilisateur: {user_count} != {TARGET_USERS} -> reset needed")
        return True
    return False


def _reset():
    """Delete demo data in its own session."""
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM historique_global"))
        db.execute(text("DELETE FROM intervention"))
        db.execute(text("DELETE FROM alerte_predictive"))
        db.execute(text("DELETE FROM ticket_maintenance"))
        db.execute(text("DELETE FROM banc_test_bdd"))
        db.execute(Utilisateur.__table__.delete().where(Utilisateur.id_user > 4))
        db.commit()
        print("  Cleared all demo tables")
    finally:
        db.close()


def _get_techs(db) -> list[int]:
    """Return [tech_a_id, tech_b_id, tech_c_id] sorted by id_user."""
    rows = (
        db.query(Utilisateur.id_user)
        .filter(Utilisateur.role == RoleUtilisateur.TECHNICIEN)
        .order_by(Utilisateur.id_user)
        .all()
    )
    return [r[0] for r in rows]


def seed():
    existing_db = SessionLocal()
    try:
        reset_needed = _needs_reset(existing_db)
    finally:
        existing_db.close()

    if reset_needed:
        _reset()
    else:
        print("Database already matches target -- skipping")
        return

    db = SessionLocal()
    try:
        now = datetime.utcnow()

        # ── Users ──
        TECH_EXTRA = [
            ("Richard", "Marie", "marie.richard@smartmaint.fr"),
            ("Petit", "Lucas", "lucas.petit@smartmaint.fr"),
        ]
        for nom, prenom, email in TECH_EXTRA:
            db.add(Utilisateur(
                nom=nom, prenom=prenom, email=email,
                mot_de_passe_hash=hash_password("Tech123!"),
                role=RoleUtilisateur.TECHNICIEN,
            ))
        db.flush()

        tech_ids = _get_techs(db)
        print(f"  Technician IDs: {tech_ids}")

        # ── Benches ──
        for b in BENCHES:
            db.add(b)
        db.flush()
        print(f"  Created {len(BENCHES)} test benches")

        # ── Tickets ──
        for i, (code_banc, symptome, criticite, id_user) in enumerate(TICKETS):
            age = timedelta(days=-(20 - i))
            db.add(TicketMaintenance(
                id_user=id_user, code_banc=code_banc, symptome=symptome,
                criticite=criticite, date_creation=now + age,
                statut=StatutTicket.OUVERT if i < 12 else StatutTicket.CLOTURE,
            ))
        db.flush()
        print(f"  Created {len(TICKETS)} tickets")

        # Map tickets to their DB ids in insertion order
        ticket_ids = [
            r[0] for r in db.query(TicketMaintenance.id_ticket)
            .order_by(TicketMaintenance.id_ticket).all()
        ]

        # ── Interventions (tech_idx resolved to actual DB id) ──
        for (tech_idx, _, typ, prio, statut, offset_days, duree), tkt_1b in zip(
            INTERVENTIONS, range(1, len(INTERVENTIONS) + 1)
        ):
            actual_tech_id = tech_ids[tech_idx]
            db.add(Intervention(
                id_technicien=actual_tech_id,
                id_manager=2,
                id_ticket=ticket_ids[tkt_1b - 1],
                type=typ, priorite=prio.value,
                date_planifiee=now + timedelta(days=offset_days),
                duree_reparation=duree or None,
                statut_intervention=statut,
            ))
        db.flush()
        print(f"  Created {len(INTERVENTIONS)} interventions")

        # ── Alerts ──
        for code_banc, composant, proba in ALERTES:
            db.add(AlertePredictive(
                code_banc=code_banc, composant_cible=composant,
                probabilite_panne=proba,
                date_detection=now + timedelta(days=-5),
                statut_alerte="active",
            ))
        db.flush()
        print(f"  Created {len(ALERTES)} predictive alerts")

        # ── History (use 1-indexed position in sorted result, not DB id) ──
        inv_rows = (
            db.query(Intervention)
            .order_by(Intervention.id_intervention)
            .all()
        )
        for pos, inv in enumerate(inv_rows, start=1):
            if inv.statut_intervention == InterventionStatus.TERMINEE and pos in HISTORIQUES:
                db.add(HistoriqueGlobal(
                    code_banc=inv.ticket.code_banc,
                    id_intervention=inv.id_intervention,
                    type_action="Intervention",
                    rapport_clean_ia=HISTORIQUES[pos],
                    date_cloture=now,
                    mttr_calcule=inv.duree_reparation,
                ))
        db.flush()
        h_count = db.query(HistoriqueGlobal).count()
        print(f"  Created {h_count} history entries")

        db.commit()
        print(f"\nSeed OK: {TARGET_USERS} users, {TARGET_BENCHES} benches, "
              f"{TARGET_TICKETS} tickets, {TARGET_INTERVENTIONS} interventions, "
              f"{TARGET_ALERTES} alerts, {h_count} history")

    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
