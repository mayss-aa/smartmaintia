import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { cn } from '@/lib/utils'
import type { SectionState, TechnicianCardData } from '../types/dashboard'

interface TechnicianWorkloadSectionProps {
  state: SectionState<TechnicianCardData[]>
}

const statusConfig = {
  normal: { label: 'Normal', class: 'bg-success/10 text-success border-success/20' },
  occupe: { label: 'Occupé', class: 'bg-warning/10 text-warning border-warning/20' },
  surcharge: { label: 'Surchargé', class: 'bg-error/10 text-error border-error/20' },
}

export function TechnicianWorkloadSection({ state }: TechnicianWorkloadSectionProps) {
  const navigate = useNavigate()

  if (state.status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Charge des techniciens</h3>
        <div className="flex h-32 items-center justify-center">
          <Loader size="md" />
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Charge des techniciens</h3>
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-text-secondary">Impossible de charger la charge des techniciens.</p>
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

  const cards = state.data ?? []

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Charge des techniciens</h3>
        <EmptyState title="Aucun technicien" description="Aucun technicien disponible pour le moment." />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <h3 className="mb-4 text-base font-semibold text-text-primary">Charge des techniciens</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((tech) => {
          const cfg = statusConfig[tech.statut]
          return (
            <button
              key={tech.id}
              onClick={() => navigate(`/interventions?technicien=${tech.id}`)}
              className="flex flex-col gap-3 rounded-lg border border-border bg-neutral-50 p-4 text-left transition-colors hover:bg-neutral-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  {tech.prenom} {tech.nom}
                </span>
                <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', cfg.class)}>
                  {cfg.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-secondary">En cours :</span>
                  <p className="font-medium text-text-primary">{tech.enCours}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Retard :</span>
                  <p className={cn('font-medium', tech.retard > 0 ? 'text-error' : 'text-text-primary')}>
                    {tech.retard}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => navigate('/interventions')}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-text-primary transition-colors hover:bg-neutral-50"
      >
        <ArrowRight className="h-4 w-4" />
        Ouvrir les interventions
      </button>
    </div>
  )
}
