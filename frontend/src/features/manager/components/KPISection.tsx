import { Percent, Clock, Wrench, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Loader } from '@/components/feedback/Loader'
import type { SectionState, KPIData } from '../types/dashboard'

interface KPISectionProps {
  state: SectionState<KPIData>
}

export function KPISection({ state }: KPISectionProps) {
  const navigate = useNavigate()

  if (state.status === 'loading') {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader size="md" />
      </div>
    )
  }

  if (state.status === 'error' || !state.data) {
    return null
  }

  const { disponibilite, mttr, enCours, retard } = state.data

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={Percent}
        value={`${disponibilite}%`}
        title="Disponibilité bancs"
        color="success"
      />
      <MetricCard
        icon={Clock}
        value={mttr != null ? `${mttr} min` : 'N/A'}
        title="MTTR moyen"
        color="warning"
      />
      <MetricCard
        icon={Wrench}
        value={enCours}
        title="En cours"
        color="primary"
        onClick={() => navigate('/interventions')}
      />
      <MetricCard
        icon={AlertTriangle}
        value={retard}
        title="En retard"
        color={retard > 0 ? 'error' : 'success'}
        onClick={() => navigate('/interventions')}
      />
    </div>
  )
}
