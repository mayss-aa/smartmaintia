export interface HistoryEntry {
  id_historique: number
  code_banc: string
  id_intervention?: number
  type_action: string
  rapport_clean_ia?: string
  date_cloture: string
  mttr_calcule?: number
}
