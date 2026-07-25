export interface Alert {
  id_alerte: number
  code_banc: string
  composant_cible: string
  probabilite_panne: number
  date_detection: string
  statut_alerte: string
}

export interface CreateAlertPayload {
  code_banc: string
  composant_cible: string
  probabilite_panne: number
  date_detection: string
  statut_alerte: string
}

export interface UpdateAlertPayload {
  code_banc?: string
  composant_cible?: string
  probabilite_panne?: number
  date_detection?: string
  statut_alerte?: string
}
