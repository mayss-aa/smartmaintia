import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/table/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Modal } from '@/components/common/Modal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useToast } from '@/components/feedback/Toast'
import { usePlanning, useUpdatePlanning } from '@/features/planning/hooks/usePlanning'
import type { PlanningItem, UpdatePlanningPayload } from '@/types/planning'
import { useAuth } from '@/store/auth/useAuth'
import { ROLES } from '@/constants/roles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'day' | 'week' | 'month'

const assignSchema = z.object({
  id_technicien: z.string().min(1, 'Le technicien est obligatoire'),
})

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function Planning() {
  const [search, setSearch] = useState('')
  const [assignTarget, setAssignTarget] = useState<PlanningItem | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<PlanningItem | undefined>()
  const [detailTarget, setDetailTarget] = useState<PlanningItem | undefined>()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  const { user } = useAuth()
  const isTechnician = user?.role === ROLES.TECHNICIEN
  const isManager = user?.role === ROLES.MANAGER_MAINTENANCE
  const toast = useToast()

  const { data: planning, isLoading, isError } = usePlanning()
  const updateMutation = useUpdatePlanning()

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(assignSchema) })

  const typeLabels: Record<string, string> = {
    CURATIF: 'Curatif',
    PREVENTIF: 'Préventif',
    PREDICTIF: 'Prédictif',
  }

  const filtered = (planning ?? []).filter(
    (p) =>
      (p.ticket_code_banc ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.technicien_nom ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const interventionsByDate = useMemo(() => {
    const map = new Map<string, PlanningItem[]>()
    if (!planning) return map
    for (const item of planning) {
      const dateKey = new Date(item.date_planifiee).toLocaleDateString('fr-FR')
      const arr = map.get(dateKey) ?? []
      arr.push(item)
      map.set(dateKey, arr)
    }
    return map
  }, [planning])

  const weekStart = useMemo(() => getMonday(currentDate), [currentDate])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const grid: (Date | null)[] = []
    for (let i = 0; i < startPad; i++) grid.push(null)
    for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d))
    while (grid.length % 7 !== 0) grid.push(null)
    return grid
  }, [currentDate])

  const navigatePrev = () => {
    if (viewMode === 'day') setCurrentDate((d) => addDays(d, -1))
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, -7))
    else if (viewMode === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const navigateNext = () => {
    if (viewMode === 'day') setCurrentDate((d) => addDays(d, 1))
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, 7))
    else if (viewMode === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const periodLabel = useMemo(() => {
    if (viewMode === 'day') return currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    if (viewMode === 'week') {
      const start = weekDays[0]
      const end = weekDays[6]
      return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`
    }
    if (viewMode === 'month') return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    return ''
  }, [viewMode, currentDate, weekDays])

  const priorityBadge = (p?: string) => {
    if (!p) return <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">-</span>
    const colors: Record<string, string> = {
      CRITIQUE: 'border-error/20 bg-error/10 text-error',
      HAUTE: 'border-warning/20 bg-warning/10 text-warning',
      MOYENNE: 'border-info/20 bg-info/10 text-info',
      BASSE: 'border-success/20 bg-success/10 text-success',
    }
    const labels: Record<string, string> = {
      CRITIQUE: 'Critique',
      HAUTE: 'Haute',
      MOYENNE: 'Moyenne',
      BASSE: 'Faible',
    }
    const colorClass = colors[p] ?? 'border-neutral-200 bg-neutral-100 text-neutral-600'
    const label = labels[p] ?? p
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: 'currentColor', opacity: 0.6 }} />
        {label}
      </span>
    )
  }

  const priorityCardStyle = (p?: string) => {
    const styles: Record<string, { border: string, bg: string, dot: string, text: string }> = {
      CRITIQUE: { border: 'border-error/30', bg: 'bg-error/5', dot: 'bg-error', text: 'text-error' },
      HAUTE: { border: 'border-warning/30', bg: 'bg-warning/5', dot: 'bg-warning', text: 'text-warning' },
      MOYENNE: { border: 'border-info/30', bg: 'bg-info/5', dot: 'bg-info', text: 'text-info' },
      BASSE: { border: 'border-success/30', bg: 'bg-success/5', dot: 'bg-success', text: 'text-success' },
    }
    return styles[p ?? ''] ?? { border: 'border-neutral-200', bg: 'bg-neutral-50', dot: 'bg-neutral-400', text: 'text-neutral-600' }
  }

  const columns: ColumnDef<PlanningItem>[] = [
    { accessorKey: 'id_intervention', header: 'ID' },
    {
      accessorKey: 'date_planifiee', header: 'Date',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('fr-FR'),
    },
    {
      accessorKey: 'date_planifiee', header: 'Heure',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      accessorKey: 'type', header: 'Type',
      cell: ({ getValue }) => typeLabels[getValue() as string] ?? (getValue() as string),
    },
    {
      accessorKey: 'priorite', header: 'Priorité',
      cell: ({ getValue }) => priorityBadge(getValue() as string | undefined),
    },
    ...(isTechnician ? [] : [{ accessorKey: 'technicien_nom', header: 'Technicien', cell: ({ getValue }: { getValue: () => unknown }) => (getValue() as string) || 'Non assigné' }]),
    { accessorKey: 'statut_intervention', header: 'Statut', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'ticket_code_banc', header: 'Banc', cell: ({ getValue }) => (getValue() as string) || '-' },
    ...(isManager ? [{
      accessorKey: 'id_intervention' as const,
      header: 'Actions',
      cell: ({ getValue }: { getValue: () => unknown }) => {
        const id = getValue() as number
        const item = planning?.find((p) => p.id_intervention === id)
        if (!item) return null
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 text-text-secondary hover:bg-error/10 hover:text-error" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
          </div>
        )
      },
    }] : []),
  ]

  const renderDayView = () => {
    const dateKey = currentDate.toLocaleDateString('fr-FR')
    const dayItems = interventionsByDate.get(dateKey) ?? []
    return (
      <div className="space-y-3">
        {dayItems.length === 0 ? (
          <EmptyState title="Aucune intervention" description={`Aucune intervention prévue le ${dateKey}.`} />
        ) : (
          dayItems.map((item) => (
            <div key={item.id_intervention} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">#{item.id_intervention}</span>
                  <StatusBadge status={item.statut_intervention} />
                  {priorityBadge(item.priorite)}
                </div>
                <p className="text-xs text-text-secondary">
                  {new Date(item.date_planifiee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {' — '}
                  {item.technicien_nom || 'Non assigné'} — {item.ticket_code_banc || '-'}
                </p>
              </div>
              {isManager && (
                <button onClick={() => setAssignTarget(item)} className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-medium text-white hover:bg-primary-700">
                  <Calendar className="mr-1 inline h-3 w-3" />Assigner
                </button>
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <div className="flex gap-2" style={{ minWidth: '700px' }}>
        {weekDays.map((day, idx) => {
          const dateKey = day.toLocaleDateString('fr-FR')
          const dayItems = interventionsByDate.get(dateKey) ?? []
          const isToday = day.toDateString() === new Date().toDateString()
          return (
            <div key={idx} className="flex-1" style={{ minHeight: '8rem' }}>
              <div className={cn('rounded-fluid border border-border bg-white p-2 h-full', isToday && 'border-primary-500')}>
                <p className={cn('mb-1 text-center text-fluid-sm font-semibold', isToday ? 'text-primary-500' : 'text-text-secondary')}>
                  {DAY_NAMES[day.getDay()]}
                  <br />
                  <span className="text-fluid-sm">{day.getDate()}</span>
                </p>
                {dayItems.map((item) => (
                  <div key={item.id_intervention} className="mb-1 rounded bg-neutral-100 px-1 py-1 text-fluid-sm leading-tight">
                    <p className="truncate font-medium text-text-primary mb-0">#{item.id_intervention}</p>
                    <p className="truncate text-text-secondary mb-0">{item.technicien_nom || '-'}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <span className="text-text-secondary">{typeLabels[item.type] ?? item.type}</span>
                      {item.priorite && (
                        <span className={cn(
                          'inline-block h-2 w-2 rounded-full shrink-0',
                          item.priorite === 'CRITIQUE' ? 'bg-error' :
                          item.priorite === 'HAUTE' ? 'bg-warning' :
                          item.priorite === 'MOYENNE' ? 'bg-info' : 'bg-neutral-400'
                        )} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-border rounded-fluid overflow-hidden border border-border">
      {DAY_NAMES.map((d) => (
        <div key={d} className="bg-surface px-2 py-2 text-center text-fluid-sm font-semibold text-text-secondary border-b border-border">
          {d}
        </div>
      ))}
      {monthGrid.map((date, idx) => {
        if (!date) {
          return (
            <div key={`empty-${idx}`} className="bg-neutral-50/50 min-h-[6rem] p-1" />
          )
        }
        const dateKey = date.toLocaleDateString('fr-FR')
        const dayItems = interventionsByDate.get(dateKey) ?? []
        const isToday = date.toDateString() === new Date().toDateString()
        const isCurrentMonth = date.getMonth() === currentDate.getMonth()
        return (
          <div
            key={idx}
            className={cn(
              'min-h-[6rem] p-1.5 transition-colors duration-150',
              isCurrentMonth ? 'bg-surface' : 'bg-neutral-50/50',
            )}
          >
            <p className={cn(
              'mb-1 text-xs font-semibold leading-tight w-5 h-5 flex items-center justify-center rounded-full',
              isToday && 'bg-primary-600 text-white',
              !isToday && isCurrentMonth && 'text-text-primary',
              !isToday && !isCurrentMonth && 'text-text-secondary',
            )}>
              {date.getDate()}
            </p>
            <div className="space-y-0.5">
              {dayItems.slice(0, 4).map((item) => {
                const cs = priorityCardStyle(item.priorite)
                const timeStr = new Date(item.date_planifiee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={item.id_intervention} className="group relative">
                    <div
                      onClick={() => setDetailTarget(item)}
                      className={cn(
                        'rounded border-l-2 px-1.5 py-1 text-xs cursor-pointer transition-all duration-150 hover:shadow-sm hover:scale-[1.02]',
                        cs.border, cs.bg,
                      )}
                      style={{ borderLeftColor: 'currentColor' }}
                    >
                      <p className="truncate font-medium leading-tight text-text-primary">{timeStr}</p>
                      <p className="truncate leading-tight text-text-secondary">{typeLabels[item.type] ?? item.type}</p>
                      <p className="truncate leading-tight text-text-secondary">{item.ticket_code_banc || '-'}</p>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute z-50 bottom-full left-0 mb-1.5 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 pointer-events-none">
                      <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                        <p className="font-medium mb-0.5">{typeLabels[item.type] ?? item.type}</p>
                        <p className="text-neutral-300 mb-0.5">{item.technicien_nom || 'Non assigné'}</p>
                        <div className="flex items-center gap-2 mb-0.5">
                          {priorityBadge(item.priorite)}
                          <StatusBadge status={item.statut_intervention} />
                        </div>
                        <p className="text-neutral-300">{timeStr}</p>
                        <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900" />
                      </div>
                    </div>
                  </div>
                )
              })}
              {dayItems.length > 4 && (
                <p className="text-xs text-text-secondary pt-0.5">+{dayItems.length - 4} autre{dayItems.length - 4 > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div>
      <PageHeader title="Planning" description={isManager ? 'Planification des interventions' : 'Mon planning'} />

      {/* View toggle + navigation */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-0.5">
          {(['list', 'day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === mode
                  ? 'bg-primary-600 text-white'
                  : 'text-text-secondary hover:bg-neutral-100',
              )}
            >
              {mode === 'list' ? 'Liste' : mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
        {viewMode !== 'list' && (
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(new Date())} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-neutral-100 transition-colors">
              Aujourd'hui
            </button>
            <div className="flex items-center gap-1">
              <button onClick={navigatePrev} className="rounded-lg p-1.5 text-text-secondary hover:bg-neutral-100 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-text-primary min-w-[180px] text-center">{periodLabel}</span>
              <button onClick={navigateNext} className="rounded-lg p-1.5 text-text-secondary hover:bg-neutral-100 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode !== 'list' && (
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher dans le planning..." />
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader /></div>
      ) : isError ? (
        <EmptyState title="Erreur de chargement" description="Impossible de charger le planning." />
      ) : viewMode === 'list' ? (
        <div>
          <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Rechercher dans le planning..." /></div>
          {filtered.length === 0 ? (
            <EmptyState title="Aucune planification" />
          ) : (
            <DataTable columns={columns as ColumnDef<PlanningItem>[]} data={filtered} pageSize={10} />
          )}
        </div>
      ) : viewMode === 'day' ? (
        renderDayView()
      ) : viewMode === 'week' ? (
        renderWeekView()
      ) : (
        renderMonthView()
      )}

      <Modal open={!!assignTarget} onClose={() => setAssignTarget(undefined)} title="Assigner un technicien" size="sm">
        <form onSubmit={handleSubmit((data) => {
          if (!assignTarget) return
          updateMutation.mutate({ id: assignTarget.id_intervention, payload: { id_technicien: Number(data.id_technicien) } as UpdatePlanningPayload }, {
            onSuccess: () => { setAssignTarget(undefined); toast.addToast('Technicien assigné', 'success') },
            onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
          })
        })} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">ID Technicien</label>
            <input type="number" {...register('id_technicien')} className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 ${errors.id_technicien ? 'border-error' : 'border-border'}`} />
            {errors.id_technicien && <p className="mt-1 text-xs text-error">{errors.id_technicien.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAssignTarget(undefined)} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary hover:bg-neutral-50">Annuler</button>
            <button type="submit" disabled={updateMutation.isPending} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">Assigner</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!detailTarget} onClose={() => setDetailTarget(undefined)} title={detailTarget ? `Intervention #${detailTarget.id_intervention}` : ''} size="sm">
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">ID</span>
              <span className="text-text-primary">#{detailTarget.id_intervention}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Type</span>
              <span className="text-text-primary">{typeLabels[detailTarget.type] ?? detailTarget.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Statut</span>
              <StatusBadge status={detailTarget.statut_intervention} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Priorité</span>
              {priorityBadge(detailTarget.priorite)}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Technicien</span>
              <span className="text-text-primary">{detailTarget.technicien_nom || 'Non assigné'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Banc de test</span>
              <span className="text-text-primary">{detailTarget.ticket_code_banc || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Date planifiée</span>
              <span className="text-text-primary">{new Date(detailTarget.date_planifiee).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-secondary">Heure planifiée</span>
              <span className="text-text-primary">{new Date(detailTarget.date_planifiee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {detailTarget.duree_reparation && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-secondary">Durée estimée</span>
                <span className="text-text-primary">{detailTarget.duree_reparation}h</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(undefined)} onConfirm={() => deleteTarget && updateMutation.mutate({ id: deleteTarget.id_intervention, payload: { statut_intervention: 'annulé' } as UpdatePlanningPayload }, {
        onSuccess: () => { setDeleteTarget(undefined); toast.addToast('Intervention annulée', 'success') },
        onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
      })} title="Annuler l'intervention" message={`Annuler l'intervention #${deleteTarget?.id_intervention} ?`} confirmLabel="Annuler" isLoading={updateMutation.isPending} />
    </div>
  )
}
