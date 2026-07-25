export interface PlanningItem {
  id_intervention: number
  id_technicien?: number
  id_manager?: number
  id_ticket?: number
  id_alerte?: number | null
  type: string
  date_planifiee: string
  duree_reparation?: number
  statut_intervention: string
  priorite?: string
  technicien_nom?: string
  technicien_prenom?: string
  manager_nom?: string
  manager_prenom?: string
  ticket_code_banc?: string
  banc_nom?: string
  banc_emplacement?: string
}

export interface UpdatePlanningPayload {
  id_technicien?: number
  type?: string
  date_planifiee?: string
  duree_reparation?: number
  statut_intervention?: string
}
