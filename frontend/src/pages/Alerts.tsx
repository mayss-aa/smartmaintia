import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Wrench } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/table/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/common/Modal'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useAlerts } from '@/features/alerts/hooks/useAlerts'
import type { Alert } from '@/types/alert'

function priorityLabel(prob: number): { label: string; color: string } {
  if (prob >= 0.8) return { label: 'Critique', color: 'text-error' }
  if (prob >= 0.5) return { label: 'Haute', color: 'text-warning' }
  if (prob >= 0.2) return { label: 'Moyenne', color: 'text-info' }
  return { label: 'Basse', color: 'text-text-secondary' }
}

export default function Alerts() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [detailTarget, setDetailTarget] = useState<Alert | undefined>()
  const { data: alerts, isLoading } = useAlerts()

  const filtered = (alerts ?? []).filter(
    (a) =>
      a.composant_cible.toLowerCase().includes(search.toLowerCase()) ||
      a.code_banc.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnDef<Alert>[] = [
    { accessorKey: 'id_alerte', header: 'ID' },
    { accessorKey: 'code_banc', header: 'Banc' },
    { accessorKey: 'composant_cible', header: 'Description' },
    {
      accessorKey: 'probabilite_panne',
      header: 'Priorité',
      cell: ({ getValue }) => {
        const val = getValue() as number
        const prio = priorityLabel(val)
        return <span className={prio.color}>{prio.label}</span>
      },
    },
    {
      accessorKey: 'probabilite_panne',
      header: 'Probabilité',
      cell: ({ getValue }) => {
        const val = getValue() as number
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-neutral-200">
              <div
                className={`h-full rounded-full ${
                  val >= 0.8 ? 'bg-error' : val >= 0.5 ? 'bg-warning' : 'bg-info'
                }`}
                style={{ width: `${(val * 100).toFixed(0)}%` }}
              />
            </div>
            <span className="text-xs font-medium">{(val * 100).toFixed(0)}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'statut_alerte',
      header: 'Statut',
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      accessorKey: 'date_detection',
      header: 'Date',
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString('fr-FR'),
    },
    {
      accessorKey: 'id_alerte',
      header: 'Actions',
      cell: ({ getValue }) => {
        const id = getValue() as number
        const alert = alerts?.find((a) => a.id_alerte === id)
        if (!alert) return null
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDetailTarget(alert)}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary-600"
              aria-label="Détail"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(`/interventions/new?alertId=${alert.id_alerte}`)}
              className="rounded-lg bg-primary-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
            >
              <Wrench className="mr-1 inline h-3 w-3" />
              Work Order
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Alertes Prédictives"
        description="Alertes générées automatiquement par le système SmartMaint IA"
      />
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher une alerte..."
        />
      </div>
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucune alerte"
          description="Aucune alerte prédictive à afficher."
        />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={10} />
      )}

      <Modal
        open={!!detailTarget}
        onClose={() => setDetailTarget(undefined)}
        title={`Alerte #${detailTarget?.id_alerte}`}
        size="sm"
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-text-secondary">Banc :</span>
              <p className="mt-1 text-text-primary">{detailTarget.code_banc}</p>
            </div>
            <div>
              <span className="font-medium text-text-secondary">Composant cible :</span>
              <p className="mt-1 text-text-primary">{detailTarget.composant_cible}</p>
            </div>
            <div>
              <span className="font-medium text-text-secondary">Priorité :</span>
              <p className={`mt-1 font-medium ${priorityLabel(detailTarget.probabilite_panne).color}`}>
                {priorityLabel(detailTarget.probabilite_panne).label}
              </p>
            </div>
            <div>
              <span className="font-medium text-text-secondary">Probabilité de panne :</span>
              <p className="mt-1 text-text-primary">
                {(detailTarget.probabilite_panne * 100).toFixed(1)}%
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="font-medium text-text-secondary">Statut :</span>
                <div className="mt-1">
                  <StatusBadge status={detailTarget.statut_alerte} />
                </div>
              </div>
              <div>
                <span className="font-medium text-text-secondary">Date détection :</span>
                <p className="mt-1 text-text-primary">
                  {new Date(detailTarget.date_detection).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
