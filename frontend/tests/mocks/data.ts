import type { User } from '@/types/auth'
import type { LoginResponse } from '@/types/auth'
import type { DashboardData } from '@/types/dashboard'
import type { Ticket, CreateTicketPayload, UpdateTicketPayload } from '@/types/ticket'
import type { Intervention, CreateInterventionPayload, UpdateInterventionPayload } from '@/types/intervention'
import type { PlanningItem, CreatePlanningPayload, UpdatePlanningPayload } from '@/types/planning'
import type { HistoryEntry } from '@/types/history'
import type { Alert } from '@/types/alert'
import type { TestBench } from '@/features/test-benches/services/test-benches.service'

export const mockAdminUser: User = {
  id_user: 1,
  nom: 'Admin',
  prenom: 'System',
  email: 'admin@smartmaint.com',
  role: 'ADMINISTRATEUR',
}

export const mockManagerUser: User = {
  id_user: 2,
  nom: 'Manager',
  prenom: 'Test',
  email: 'manager@smartmaint.com',
  role: 'MANAGER_MAINTENANCE',
}

export const mockTechnicianUser: User = {
  id_user: 3,
  nom: 'Technicien',
  prenom: 'Jean',
  email: 'technicien@smartmaint.com',
  role: 'TECHNICIEN',
}

export const mockOperatorUser: User = {
  id_user: 4,
  nom: 'Operateur',
  prenom: 'Pierre',
  email: 'operateur@smartmaint.com',
  role: 'OPERATEUR_PRODUCTION',
}

export const mockLoginResponse: LoginResponse = {
  access_token: 'mock-jwt-token-12345',
  token_type: 'bearer',
}

export const mockDashboardData: DashboardData = {
  total_utilisateurs: 10,
  total_bancs: 5,
  total_tickets: 20,
  total_interventions: 15,
  total_alertes: 8,
  total_historiques: 50,
  bancs_operationnels: 3,
  bancs_en_panne: 1,
  bancs_en_maintenance: 1,
  tickets_ouverts: 5,
  tickets_en_cours: 8,
  tickets_clotures: 7,
  utilisateurs_administrateur: 1,
  utilisateurs_manager_maintenance: 2,
  utilisateurs_technicien: 4,
  utilisateurs_operateur_production: 3,
}

export const mockTestBenches: TestBench[] = [
  { code_banc: 'BANC-001', nom: 'Banc Alpha', statut: 'OPERATIONNEL', emplacement: 'Atelier A' },
  { code_banc: 'BANC-002', nom: 'Banc Beta', statut: 'EN_PANNE', emplacement: 'Atelier B' },
  { code_banc: 'BANC-003', nom: 'Banc Gamma', statut: 'EN_MAINTENANCE', emplacement: 'Atelier A' },
]

export const mockTickets: Ticket[] = [
  { id_ticket: 1, code_banc: 'BANC-001', symptome: 'Bruit anormal', criticite: 'HAUTE', date_creation: '2026-07-15T10:00:00Z', statut: 'OUVERT' },
  { id_ticket: 2, code_banc: 'BANC-002', symptome: 'Erreur logicielle', criticite: 'MOYENNE', date_creation: '2026-07-14T14:30:00Z', statut: 'EN_COURS' },
  { id_ticket: 3, code_banc: 'BANC-003', symptome: 'Surchauffe moteur', criticite: 'CRITIQUE', date_creation: '2026-07-13T08:15:00Z', statut: 'CLOTURE' },
]

export const mockCreateTicketPayload: CreateTicketPayload = {
  code_banc: 'BANC-001',
  symptome: 'Nouveau problème',
  criticite: 'MOYENNE',
}

export const mockUpdateTicketPayload: UpdateTicketPayload = {
  statut: 'EN_COURS',
}

export const mockInterventions: Intervention[] = [
  { id_intervention: 1, id_technicien: 3, id_manager: 2, id_ticket: 1, type: 'CURATIF', date_planifiee: '2026-07-17T08:00:00Z', duree_reparation: 120, statut_intervention: 'planifié', technicien_nom: 'Jean', technicien_prenom: 'Technicien', ticket_code_banc: 'BANC-001' },
  { id_intervention: 2, id_technicien: 3, id_manager: 2, id_ticket: 2, type: 'PREVENTIF', date_planifiee: '2026-07-16T10:00:00Z', duree_reparation: 90, statut_intervention: 'en_cours', technicien_nom: 'Jean', ticket_code_banc: 'BANC-002' },
  { id_intervention: 3, id_technicien: 3, id_manager: 2, id_ticket: 3, type: 'CURATIF', date_planifiee: '2026-07-15T09:00:00Z', duree_reparation: 60, statut_intervention: 'terminé', technicien_nom: 'Jean', ticket_code_banc: 'BANC-003' },
]

export const mockCreateInterventionPayload: CreateInterventionPayload = {
  id_technicien: 3,
  id_manager: 2,
  id_ticket: 1,
  type: 'CURATIF',
  date_planifiee: '2026-07-18T08:00:00Z',
  duree_reparation: 120,
  statut_intervention: 'planifié',
}

export const mockUpdateInterventionPayload: UpdateInterventionPayload = {
  statut_intervention: 'en_cours',
}

export const mockPlanningEntries: PlanningItem[] = [
  { id_intervention: 1, id_technicien: 3, id_manager: 2, id_ticket: 1, type: 'CURATIF', date_planifiee: '2026-07-17T08:00:00Z', duree_reparation: 120, statut_intervention: 'planifié', technicien_nom: 'Jean', ticket_code_banc: 'BANC-001', banc_nom: 'Banc Alpha', banc_emplacement: 'Atelier A' },
  { id_intervention: 2, id_technicien: 3, id_manager: 2, id_ticket: 2, type: 'PREVENTIF', date_planifiee: '2026-07-16T10:00:00Z', duree_reparation: 90, statut_intervention: 'en_cours', technicien_nom: 'Jean', ticket_code_banc: 'BANC-002', banc_nom: 'Banc Beta', banc_emplacement: 'Atelier B' },
]

export const mockCreatePlanningPayload: CreatePlanningPayload = {
  id_technicien: 3,
  id_manager: 2,
  id_ticket: 1,
  type: 'CURATIF',
  date_planifiee: '2026-07-18T08:00:00Z',
  duree_reparation: 120,
  statut_intervention: 'planifié',
}

export const mockUpdatePlanningPayload: UpdatePlanningPayload = {
  id_technicien: 3,
  statut_intervention: 'en_cours',
}

export const mockHistoryEntries: HistoryEntry[] = [
  { id_historique: 1, code_banc: 'BANC-001', id_intervention: 3, type_action: 'Réparation moteur', rapport_clean_ia: 'Intervention terminée avec succès.', date_cloture: '2026-07-15T14:00:00Z', mttr_calcule: 120 },
  { id_historique: 2, code_banc: 'BANC-002', id_intervention: 2, type_action: 'Maintenance préventive', date_cloture: '2026-07-14T16:00:00Z', mttr_calcule: 90 },
]

export const mockAlerts: Alert[] = [
  { id_alerte: 1, code_banc: 'BANC-001', composant_cible: 'Moteur principal', probabilite_panne: 0.85, date_detection: '2026-07-16T12:00:00Z', statut_alerte: 'Nouvelle' },
  { id_alerte: 2, code_banc: 'BANC-002', composant_cible: 'Capteur température', probabilite_panne: 0.45, date_detection: '2026-07-15T08:00:00Z', statut_alerte: 'Validée' },
]
