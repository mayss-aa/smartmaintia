export interface DashboardData {
  total_utilisateurs: number
  total_bancs: number
  total_tickets: number
  total_interventions: number
  total_alertes: number
  total_historiques: number
  bancs_operationnels: number
  bancs_en_panne: number
  bancs_en_maintenance: number
  tickets_ouverts: number
  tickets_en_cours: number
  tickets_clotures: number
  utilisateurs_administrateur: number
  utilisateurs_manager_maintenance: number
  utilisateurs_technicien: number
  utilisateurs_operateur_production: number
  taux_disponibilite_bancs: number
  mttr_moyen: number | null
  interventions_cloturees_mois: number
}
