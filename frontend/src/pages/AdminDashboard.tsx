import { Users, LayoutDashboard, CheckCircle, Ban, AlertTriangle } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ChartCard } from '@/components/dashboard/ChartCard'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'

const PIE_COLORS = ['#1D4ED8', '#F59E0B', '#22C55E', '#EF4444']
const BAR_COLORS = ['#22C55E', '#EF4444', '#F59E0B']

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger les données du tableau de bord."
      />
    )
  }

  const usersByRole = [
    { role: 'Administrateurs', count: data.utilisateurs_administrateur },
    { role: 'Managers', count: data.utilisateurs_manager_maintenance },
    { role: 'Techniciens', count: data.utilisateurs_technicien },
    { role: 'Opérateurs', count: data.utilisateurs_operateur_production },
  ].filter((u) => u.count > 0)

  const bancsByStatus = [
    { status: 'OPERATIONNEL', count: data.bancs_operationnels },
    { status: 'EN_PANNE', count: data.bancs_en_panne },
    { status: 'EN_MAINTENANCE', count: data.bancs_en_maintenance },
  ].filter((b) => b.count > 0)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-fluid-2xl font-bold text-text-primary">
          Administration
        </h1>
        <p className="mt-1 text-fluid-sm text-text-secondary">
          Vue globale du système — utilisateurs et bancs de test
        </p>
      </div>

      <div className="grid w-full gap-fluid-sm grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard icon={Users} value={data.total_utilisateurs} title="Utilisateurs" color="primary" />
        <MetricCard icon={LayoutDashboard} value={data.total_bancs} title="Bancs de test" color="info" />
        <MetricCard icon={CheckCircle} value={data.bancs_operationnels} title="Opérationnels" color="success" />
        <MetricCard icon={AlertTriangle} value={data.bancs_en_maintenance} title="En maintenance" color="warning" />
        <MetricCard icon={Ban} value={data.bancs_en_panne} title="En panne" color="error" />
      </div>

      <div className="grid grid-cols-12 gap-fluid-sm gap-4">
        <div className="col-span-12 lg:col-span-6">
          <ChartCard title="Répartition des utilisateurs">
            {usersByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#1D4ED8"
                    label
                  >
                    {usersByRole.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="Aucune donnée" />
            )}
          </ChartCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <ChartCard title="Statut des bancs de test">
            {bancsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bancsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {bancsByStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="Aucune donnée" />
            )}
          </ChartCard>
        </div>
      </div>

      <div className="rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-text-primary">Utilisateurs par rôle</h3>
        <div className="grid grid-cols-12 gap-fluid-sm gap-3">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-fluid border border-border bg-neutral-100 p-3 text-center">
              <p className="text-fluid-xl font-semibold font-bold text-primary-500">{data.utilisateurs_administrateur}</p>
              <p className="mb-0 text-fluid-sm text-text-secondary">Administrateurs</p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-fluid border border-border bg-neutral-100 p-3 text-center">
              <p className="text-fluid-xl font-semibold font-bold text-warning">{data.utilisateurs_manager_maintenance}</p>
              <p className="mb-0 text-fluid-sm text-text-secondary">Managers</p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-fluid border border-border bg-neutral-100 p-3 text-center">
              <p className="text-fluid-xl font-semibold font-bold text-info">{data.utilisateurs_technicien}</p>
              <p className="mb-0 text-fluid-sm text-text-secondary">Techniciens</p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-fluid border border-border bg-neutral-100 p-3 text-center">
              <p className="text-fluid-xl font-semibold font-bold text-error">{data.utilisateurs_operateur_production}</p>
              <p className="mb-0 text-fluid-sm text-text-secondary">Opérateurs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
