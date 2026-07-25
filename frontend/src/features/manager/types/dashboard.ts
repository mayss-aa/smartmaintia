import type { Alert } from '@/types/alert'

export type SectionStatus = 'loading' | 'error' | 'success'

export interface SectionState<T> {
  status: SectionStatus
  data?: T
  error?: string
  refetch: () => void
}

export interface KPIData {
  disponibilite: number
  mttr: number | null
  enCours: number
  retard: number
}

export interface PendingDecisionsData {
  alertesCritiques: number
  ticketsOuverts: number
  rapportsEnAttente: number
  ordresEnRetard: number
  technicienSurcharge: boolean
}

export interface TechnicianCardData {
  id: number
  nom: string
  prenom: string
  enCours: number
  retard: number
  statut: 'normal' | 'occupe' | 'surcharge'
}

export interface PlanningSummaryData {
  aujourdHui: number
  demain: number
  conflits: number
}

export interface DashboardViewModel {
  kpi: SectionState<KPIData>
  pendingDecisions: SectionState<PendingDecisionsData>
  predictiveAlerts: SectionState<Alert[]>
  technicianWorkload: SectionState<TechnicianCardData[]>
  planningSummary: SectionState<PlanningSummaryData>
}
