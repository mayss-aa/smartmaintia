export interface Intervention {
  id_intervention: number
  id_technicien?: number
  id_manager?: number
  id_ticket?: number | null
  id_alerte?: number | null
  type: string
  priorite?: string
  date_planifiee: string
  duree_reparation?: number
  statut_intervention: string
  technicien_nom?: string
  technicien_prenom?: string
  manager_nom?: string
  manager_prenom?: string
  ticket_code_banc?: string
  rapport_clean_ia?: string
}

export interface CreateInterventionPayload {
  id_technicien: number
  id_manager: number
  id_ticket?: number | null
  id_alerte?: number | null
  type: string
  priorite?: string
  date_planifiee: string
  duree_reparation?: number
  statut_intervention: string
}

export interface CompleteInterventionPayload {
  rapport?: string
  actions_realisees?: string
  commentaire?: string
}

export interface UpdateInterventionPayload {
  id_technicien?: number
  id_manager?: number
  id_ticket?: number | null
  id_alerte?: number | null
  type?: string
  priorite?: string
  date_planifiee?: string
  duree_reparation?: number
  statut_intervention?: string
}
