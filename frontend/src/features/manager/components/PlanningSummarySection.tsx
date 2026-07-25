import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { SectionState, PlanningSummaryData } from '../types/dashboard'

interface PlanningSummarySectionProps {
  state: SectionState<PlanningSummaryData>
}

export function PlanningSummarySection({ state }: PlanningSummarySectionProps) {
  const navigate = useNavigate()

  if (state.status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Planning</h3>
        <div className="flex h-32 items-center justify-center">
          <Loader size="md" />
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Planning</h3>
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-text-secondary">Impossible de charger le planning.</p>
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

  const { aujourdHui, demain, conflits } = state.data

  if (aujourdHui === 0 && demain === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Planning</h3>
        <EmptyState title="Aucun planning" description="Aucune intervention planifiée." icon={Calendar} />
      </div>
    )
  }

  const todayStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <h3 className="mb-4 text-base font-semibold text-text-primary">Planning — {todayStr}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
          <span className="text-sm text-text-primary">📅 Aujourd'hui</span>
          <span className="text-sm font-semibold text-text-primary">{aujourdHui} ordre{aujourdHui > 1 ? 's' : ''}</span>
        </div>
        {demain > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
            <span className="text-sm text-text-primary">📅 Demain</span>
            <span className="text-sm font-semibold text-text-primary">{demain} ordre{demain > 1 ? 's' : ''}</span>
          </div>
        )}
        {conflits > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-error/5 px-4 py-3">
            <span className="text-sm text-text-primary">⚠️ Conflits</span>
            <span className="text-sm font-semibold text-error">{conflits} technicien{conflits > 1 ? 's' : ''} surchargé{conflits > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => navigate('/planning')}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-text-primary transition-colors hover:bg-neutral-50"
      >
        <ArrowRight className="h-4 w-4" />
        Ouvrir le planning
      </button>
    </div>
  )
}
