import { AlertTriangle, Ticket, FileText, Clock, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { SectionState, PendingDecisionsData } from '../types/dashboard'

interface PendingDecisionsSectionProps {
  state: SectionState<PendingDecisionsData>
}

const decisions = [
  { key: 'alertesCritiques' as const, icon: AlertTriangle, label: 'Alertes prédictives critiques', route: '/alerts', color: 'text-error' },
  { key: 'ticketsOuverts' as const, icon: Ticket, label: 'Tickets en attente', route: '/tickets', color: 'text-warning' },
  { key: 'rapportsEnAttente' as const, icon: FileText, label: 'Rapports technicien en attente', route: '/interventions', color: 'text-info' },
  { key: 'ordresEnRetard' as const, icon: Clock, label: 'Ordres de travail en retard', route: '/interventions', color: 'text-error' },
  { key: 'technicienSurcharge' as const, icon: Users, label: 'Technicien surchargé', route: '/interventions', color: 'text-error' },
]

export function PendingDecisionsSection({ state }: PendingDecisionsSectionProps) {
  const navigate = useNavigate()

  if (state.status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Décisions en attente</h3>
        <div className="flex h-32 items-center justify-center">
          <Loader size="md" />
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Décisions en attente</h3>
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-text-secondary">Impossible de charger les décisions en attente.</p>
          <button
            onClick={() => state.refetch()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!state.data) return null

  const total = decisions.reduce((sum, d) => {
    const val = state.data![d.key]
    return sum + (typeof val === 'number' ? val : val ? 1 : 0)
  }, 0)

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Décisions en attente</h3>
        <EmptyState title="Aucune décision en attente" description="Toutes les opérations sont à jour." />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <h3 className="mb-4 text-base font-semibold text-text-primary">Décisions en attente</h3>
      <div className="space-y-2">
        {decisions.map(({ key, icon: Icon, label, route, color }) => {
          const val = state.data![key]
          const count = typeof val === 'number' ? val : val ? 1 : 0
          if (count === 0) return null
          return (
            <button
              key={key}
              onClick={() => navigate(route)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-neutral-50"
            >
              <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              <span className="flex-1 text-sm text-text-primary">{label}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color} bg-current/10`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
