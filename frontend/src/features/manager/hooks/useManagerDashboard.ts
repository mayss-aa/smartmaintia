import { useMemo } from 'react'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { useAlerts } from '@/features/alerts/hooks/useAlerts'
import { useInterventions } from '@/features/interventions/hooks/useInterventions'
import { usePlanning } from '@/features/planning/hooks/usePlanning'
import { useTechnicians } from '@/features/users/hooks/useUsers'
import type { DashboardViewModel, KPIData, PendingDecisionsData, TechnicianCardData, PlanningSummaryData, SectionState } from '../types/dashboard'
import type { Alert } from '@/types/alert'

function loadingState<T>(refetch: () => void): SectionState<T> {
  return { status: 'loading', refetch }
}

function errorState<T>(error: string, refetch: () => void): SectionState<T> {
  return { status: 'error', error, refetch }
}

function successState<T>(data: T, refetch: () => void): SectionState<T> {
  return { status: 'success', data, refetch }
}

function now(): string {
  return new Date().toISOString()
}

function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10)
}

function isTomorrow(a: string, today: string): boolean {
  const d = new Date(today.slice(0, 10))
  d.setDate(d.getDate() + 1)
  return a.slice(0, 10) === d.toISOString().slice(0, 10)
}

export function useManagerDashboard(): DashboardViewModel {
  const dashboardQ = useDashboard()
  const alertsQ = useAlerts()
  const interventionsQ = useInterventions()
  const planningQ = usePlanning()
  const techsQ = useTechnicians()

  const today = now()

  const interventions = interventionsQ.data ?? []
  const alerts = alertsQ.data ?? []
  const planning = planningQ.data ?? []
  const technicians = techsQ.data ?? []

  const enCours = useMemo(
    () => interventions.filter((i) => i.statut_intervention === 'En cours'),
    [interventions],
  )

  const enRetard = useMemo(
    () => enCours.filter((i) => i.date_planifiee < today),
    [enCours, today],
  )

  const kpi = useMemo((): SectionState<KPIData> => {
    if (dashboardQ.isLoading || interventionsQ.isLoading) return loadingState<KPIData>(() => { dashboardQ.refetch(); interventionsQ.refetch() })
    if (dashboardQ.isError) return errorState<KPIData>(dashboardQ.error?.message ?? 'Une erreur est survenue', () => dashboardQ.refetch())
    if (interventionsQ.isError) return errorState<KPIData>(interventionsQ.error?.message ?? 'Une erreur est survenue', () => interventionsQ.refetch())
    if (!dashboardQ.data) return loadingState<KPIData>(() => dashboardQ.refetch())
    return successState({
      disponibilite: dashboardQ.data.taux_disponibilite_bancs ?? 0,
      mttr: dashboardQ.data.mttr_moyen,
      enCours: enCours.length,
      retard: enRetard.length,
    }, () => { dashboardQ.refetch(); interventionsQ.refetch() })
  }, [dashboardQ, interventionsQ, enCours, enRetard])

  const alertesCritiques = useMemo(
    () => alerts.filter((a) => a.statut_alerte === 'Nouvelle' && a.probabilite_panne >= 0.8).length,
    [alerts],
  )

  const rapportsEnAttente = useMemo(
    () => interventions.filter((i) => i.statut_intervention === 'Terminée').length,
    [interventions],
  )

  const technicienSurcharge = useMemo(
    () => {
      if (technicians.length === 0) return false
      return technicians.some((t) => {
        const count = interventions.filter(
          (i) => i.id_technicien === t.id_user && i.statut_intervention === 'En cours',
        ).length
        const retards = interventions.filter(
          (i) => i.id_technicien === t.id_user && i.statut_intervention === 'En cours' && i.date_planifiee < today,
        ).length
        return count >= 5 || retards >= 2
      })
    },
    [technicians, interventions, today],
  )

  const pendingDecisions = useMemo((): SectionState<PendingDecisionsData> => {
    if (dashboardQ.isLoading || alertsQ.isLoading || interventionsQ.isLoading) return loadingState<PendingDecisionsData>(() => { dashboardQ.refetch(); alertsQ.refetch(); interventionsQ.refetch() })
    if (dashboardQ.isError) return errorState<PendingDecisionsData>(dashboardQ.error?.message ?? 'Une erreur est survenue', () => dashboardQ.refetch())
    if (alertsQ.isError) return errorState<PendingDecisionsData>(alertsQ.error?.message ?? 'Une erreur est survenue', () => alertsQ.refetch())
    if (interventionsQ.isError) return errorState<PendingDecisionsData>(interventionsQ.error?.message ?? 'Une erreur est survenue', () => interventionsQ.refetch())
    return successState({
      alertesCritiques,
      ticketsOuverts: dashboardQ.data?.tickets_ouverts ?? 0,
      rapportsEnAttente,
      ordresEnRetard: enRetard.length,
      technicienSurcharge,
    }, () => { dashboardQ.refetch(); alertsQ.refetch(); interventionsQ.refetch() })
  }, [dashboardQ, alertsQ, interventionsQ, alertesCritiques, rapportsEnAttente, enRetard, technicienSurcharge])

  const predictiveAlerts = useMemo((): SectionState<Alert[]> => {
    if (alertsQ.isLoading) return loadingState<Alert[]>(() => alertsQ.refetch())
    if (alertsQ.isError) return errorState<Alert[]>(alertsQ.error?.message ?? 'Une erreur est survenue', () => alertsQ.refetch())
    const nonTraitees = alerts.filter((a) => a.statut_alerte === 'Nouvelle')
    return successState(nonTraitees, () => alertsQ.refetch())
  }, [alertsQ, alerts])

  const workload = useMemo((): SectionState<TechnicianCardData[]> => {
    if (techsQ.isLoading || interventionsQ.isLoading) return loadingState<TechnicianCardData[]>(() => { techsQ.refetch(); interventionsQ.refetch() })
    if (techsQ.isError) return errorState<TechnicianCardData[]>(techsQ.error?.message ?? 'Une erreur est survenue', () => techsQ.refetch())
    if (interventionsQ.isError) return errorState<TechnicianCardData[]>(interventionsQ.error?.message ?? 'Une erreur est survenue', () => interventionsQ.refetch())
    if (!techsQ.data) return loadingState<TechnicianCardData[]>(() => techsQ.refetch())
    const cards: TechnicianCardData[] = techsQ.data.map((t) => {
      const count = interventions.filter(
        (i) => i.id_technicien === t.id_user && i.statut_intervention === 'En cours',
      ).length
      const retards = interventions.filter(
        (i) => i.id_technicien === t.id_user && i.statut_intervention === 'En cours' && i.date_planifiee < today,
      ).length
      const statut: TechnicianCardData['statut'] = count >= 5 || retards >= 2
        ? 'surcharge'
        : count >= 3 || retards >= 1
          ? 'occupe'
          : 'normal'
      return { id: t.id_user, nom: t.nom, prenom: t.prenom, enCours: count, retard: retards, statut }
    })
    return successState(cards, () => { techsQ.refetch(); interventionsQ.refetch() })
  }, [techsQ, interventionsQ, interventions, today])

  const planningSummary = useMemo((): SectionState<PlanningSummaryData> => {
    if (planningQ.isLoading) return loadingState<PlanningSummaryData>(() => planningQ.refetch())
    if (planningQ.isError) return errorState<PlanningSummaryData>(planningQ.error?.message ?? 'Une erreur est survenue', () => planningQ.refetch())
    const aujourdHui = planning.filter((p) => isSameDay(p.date_planifiee, today))
    const demain = planning.filter((p) => isTomorrow(p.date_planifiee, today))
    const conflitsMap = new Map<number, number>()
    aujourdHui.forEach((p) => {
      if (p.id_technicien) conflitsMap.set(p.id_technicien, (conflitsMap.get(p.id_technicien) ?? 0) + 1)
    })
    const conflits = Array.from(conflitsMap.values()).filter((c) => c > 1).length
    return successState({
      aujourdHui: aujourdHui.length,
      demain: demain.length,
      conflits,
    }, () => planningQ.refetch())
  }, [planningQ, planning, today])

  return {
    kpi,
    pendingDecisions,
    predictiveAlerts,
    technicianWorkload: workload,
    planningSummary,
  }
}
