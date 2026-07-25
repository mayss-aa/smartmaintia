import { RefreshCw } from 'lucide-react'
import { useManagerDashboard } from '@/features/manager/hooks/useManagerDashboard'
import { KPISection } from '@/features/manager/components/KPISection'
import { PendingDecisionsSection } from '@/features/manager/components/PendingDecisionsSection'
import { PredictiveAlertsSection } from '@/features/manager/components/PredictiveAlertsSection'
import { TechnicianWorkloadSection } from '@/features/manager/components/TechnicianWorkloadSection'
import { PlanningSummarySection } from '@/features/manager/components/PlanningSummarySection'

export default function ManagerDashboard() {
  const dashboard = useManagerDashboard()

  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div>
          <h1 className="text-fluid-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-fluid-sm text-text-secondary">
            Centre de décision des opérations de maintenance — {dateStr} — {timeStr}
          </p>
        </div>
        <button
          onClick={() => {
            dashboard.kpi.refetch()
            dashboard.pendingDecisions.refetch()
            dashboard.predictiveAlerts.refetch()
            dashboard.technicianWorkload.refetch()
            dashboard.planningSummary.refetch()
          }}
          className="flex items-center gap-1 rounded-fluid border border-border px-3 py-2 text-fluid-sm font-medium text-text-secondary"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </button>
      </div>

      <KPISection state={dashboard.kpi} />
      <PendingDecisionsSection state={dashboard.pendingDecisions} />
      <PredictiveAlertsSection state={dashboard.predictiveAlerts} />
      <TechnicianWorkloadSection state={dashboard.technicianWorkload} />
      <PlanningSummarySection state={dashboard.planningSummary} />
    </div>
  )
}
