import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowRight } from 'lucide-react'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { SectionState } from '../types/dashboard'
import type { Alert } from '@/types/alert'

interface PredictiveAlertsSectionProps {
  state: SectionState<Alert[]>
}

function priorityLabel(prob: number): { label: string; color: string } {
  if (prob >= 0.8) return { label: 'Critique', color: 'text-error' }
  if (prob >= 0.5) return { label: 'Haute', color: 'text-warning' }
  if (prob >= 0.2) return { label: 'Moyenne', color: 'text-info' }
  return { label: 'Basse', color: 'text-text-secondary' }
}

export function PredictiveAlertsSection({ state }: PredictiveAlertsSectionProps) {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  if (state.status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Alertes Prédictives</h3>
        <div className="flex h-32 items-center justify-center">
          <Loader size="md" />
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Alertes Prédictives</h3>
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-text-secondary">Impossible de charger les alertes.</p>
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

  const alerts = state.data ?? []
  const nonTraitees = alerts
  const displayed = showAll ? nonTraitees : nonTraitees.slice(0, 4)

  if (nonTraitees.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Alertes Prédictives</h3>
        <EmptyState title="Aucune alerte" description="Aucune alerte prédictive nécessitant une décision." icon={Bell} />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Alertes Prédictives</h3>
          <p className="text-xs text-text-secondary">Recommandations IA en attente de décision</p>
        </div>
        {nonTraitees.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {showAll ? 'Voir moins' : `Voir tout (${nonTraitees.length})`}
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {displayed.map((alert) => {
          const prio = priorityLabel(alert.probabilite_panne)
          return (
            <button
              key={alert.id_alerte}
              onClick={() => navigate('/alerts')}
              className="flex flex-col gap-2 rounded-lg border border-border bg-neutral-50 p-4 text-left transition-colors hover:bg-neutral-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">{alert.code_banc}</span>
                <StatusBadge status={alert.statut_alerte} />
              </div>
              <p className="text-xs text-text-secondary">Composant : {alert.composant_cible}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className={prio.color}>Priorité : {prio.label}</span>
                <span className="text-text-secondary">
                  {new Date(alert.date_detection).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className={`h-full rounded-full ${
                      alert.probabilite_panne >= 0.8
                        ? 'bg-error'
                        : alert.probabilite_panne >= 0.5
                          ? 'bg-warning'
                          : 'bg-info'
                    }`}
                    style={{ width: `${(alert.probabilite_panne * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary">
                  {(alert.probabilite_panne * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/alerts')}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-text-primary transition-colors hover:bg-neutral-50"
      >
        <ArrowRight className="h-4 w-4" />
        Ouvrir les alertes prédictives
      </button>
    </div>
  )
}
