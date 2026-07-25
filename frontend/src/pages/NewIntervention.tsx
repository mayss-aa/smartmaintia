import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTechnicians } from '@/features/users/hooks/useUsers'
import { useAlerts } from '@/features/alerts/hooks/useAlerts'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { useCreateIntervention } from '@/features/interventions/hooks/useInterventions'
import { useAuth } from '@/store/auth/useAuth'
import { useToast } from '@/components/feedback/Toast'
import { Loader } from '@/components/feedback/Loader'

interface FormData {
  id_technicien: string
  type: string
  date_planifiee: string
  duree_reparation: string
  priorite: string
  statut_intervention: string
}

function priorityFromProbability(prob: number): string {
  if (prob >= 0.8) return 'CRITIQUE'
  if (prob >= 0.5) return 'HAUTE'
  if (prob >= 0.2) return 'MOYENNE'
  return 'BASSE'
}

export default function NewIntervention() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const toast = useToast()
  const { user } = useAuth()
  const commentRef = useRef<HTMLTextAreaElement>(null)

  const alertId = params.get('alertId')
  const ticketId = params.get('ticketId')
  const technicianId = params.get('technicianId')

  const { data: technicians, isLoading: loadingTechs } = useTechnicians()
  const { data: alerts } = useAlerts()
  const { data: tickets } = useTickets()
  const createMutation = useCreateIntervention()

  const selectedAlert = useMemo(
    () => (alertId ? alerts?.find((a) => a.id_alerte === Number(alertId)) : undefined),
    [alertId, alerts],
  )
  const selectedTicket = useMemo(
    () => (ticketId ? tickets?.find((t) => t.id_ticket === Number(ticketId)) : undefined),
    [ticketId, tickets],
  )

  const defaultPriority = useMemo(() => {
    if (selectedAlert) return priorityFromProbability(selectedAlert.probabilite_panne)
    return ''
  }, [selectedAlert])

  const defaultType = useMemo(() => {
    if (selectedAlert) return 'PREDICTIF'
    if (selectedTicket) return 'CURATIF'
    return 'CURATIF'
  }, [selectedAlert, selectedTicket])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    const initial: Partial<FormData> = {
      type: defaultType,
      priorite: defaultPriority,
      statut_intervention: 'Planifiée',
    }
    if (technicianId) {
      initial.id_technicien = technicianId
    }
    reset(initial)
  }, [defaultType, defaultPriority, technicianId, reset])

  const onSubmit = (data: FormData) => {
    createMutation.mutate(
      {
        id_technicien: Number(data.id_technicien),
        id_manager: user?.id_user ?? 0,
        id_ticket: selectedTicket?.id_ticket ?? null,
        id_alerte: selectedAlert?.id_alerte ?? null,
        type: data.type,
        priorite: data.priorite || undefined,
        date_planifiee: new Date(data.date_planifiee).toISOString(),
        duree_reparation: data.duree_reparation ? Number(data.duree_reparation) : undefined,
        statut_intervention: data.statut_intervention,
      },
      {
        onSuccess: () => {
          toast.addToast('Work order créé avec succès', 'success')
          navigate('/interventions')
        },
        onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la création', 'error'),
      },
    )
  }

  if (loadingTechs) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto px-0 px-sm-3" style={{ maxWidth: '720px' }}>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/interventions')}
          className="inline-flex h-ctrl w-ctrl items-center justify-center rounded-fluid text-text-secondary hover:bg-neutral-100 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-fluid-2xl font-bold text-text-primary">Create Work Order</h1>
          <p className="mt-1 text-fluid-sm text-text-secondary">
            {selectedAlert
              ? 'Depuis une alerte prédictive'
              : selectedTicket
                ? 'Depuis un ticket de maintenance'
                : 'Création manuelle'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
        {selectedAlert && (
          <div className="rounded-fluid border border-border p-3 text-fluid-sm" style={{ borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.05)' }}>
            <p className="mb-1 font-medium" style={{ color: 'var(--color-info)' }}>Alerte prédictive #{selectedAlert.id_alerte}</p>
            <p className="mb-0">Banc : {selectedAlert.code_banc} — Composant : {selectedAlert.composant_cible}</p>
            <p className="mb-0">Probabilité : {(selectedAlert.probabilite_panne * 100).toFixed(0)}% — Priorité : {priorityFromProbability(selectedAlert.probabilite_panne)}</p>
          </div>
        )}

        {selectedTicket && (
          <div className="rounded-fluid border border-border p-3 text-fluid-sm" style={{ borderColor: 'rgba(245,158,11,0.2)', backgroundColor: 'rgba(245,158,11,0.05)' }}>
            <p className="mb-1 font-medium" style={{ color: 'var(--color-warning)' }}>Ticket #{selectedTicket.id_ticket}</p>
            <p className="mb-0">Banc : {selectedTicket.code_banc} — Symptôme : {selectedTicket.symptome}</p>
          </div>
        )}

        {!selectedAlert && !selectedTicket && (
          <div className="rounded-fluid bg-neutral-100 p-3 text-fluid-sm text-text-secondary">
            Création manuelle d&apos;un work order de maintenance.
          </div>
        )}

        <div>
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
              Technicien <span className="text-error">*</span>
            </label>
          <select
            {...register('id_technicien', { required: 'Le technicien est obligatoire' })}
            className={`h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${errors.id_technicien ? 'border-error' : ''}`}
          >
            <option value="">Sélectionner un technicien</option>
            {technicians?.map((t) => (
              <option key={t.id_user} value={t.id_user}>
                {t.prenom} {t.nom}
              </option>
            ))}
          </select>
          {errors.id_technicien && (
            <div className="mt-1 text-fluid-sm text-error">{errors.id_technicien.message}</div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-fluid-sm">
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
              Date planifiée <span className="text-error">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('date_planifiee', { required: 'La date est obligatoire' })}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${errors.date_planifiee ? 'border-error' : ''}`}
            />
            {errors.date_planifiee && (
              <div className="mt-1 text-fluid-sm text-error">{errors.date_planifiee.message}</div>
            )}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
              Durée estimée (minutes)
            </label>
            <input
              type="number"
              min={1}
              {...register('duree_reparation')}
              className="h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              placeholder="Ex: 120"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-fluid-sm">
          <div className="col-span-12 sm:col-span-4">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Type</label>
            <select
              {...register('type')}
              className="h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="CURATIF">Curatif</option>
              <option value="PREVENTIF">Préventif</option>
              <option value="PREDICTIF">Prédictif</option>
            </select>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Priorité</label>
            <select
              {...register('priorite')}
              className="h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="">Sélectionner</option>
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Statut</label>
            <select
              {...register('statut_intervention')}
              className="h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="Planifiée">Planifiée</option>
              <option value="En cours">En cours</option>
            </select>
          </div>
        </div>

        <div>
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Commentaire</label>
            <textarea
              ref={commentRef}
              rows={3}
              className="w-full resize-none rounded-fluid border border-border bg-white px-3 py-2 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              placeholder="Instructions ou notes pour le technicien..."
            />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate('/interventions')}
            className="inline-flex h-ctrl items-center justify-center rounded-fluid border border-border bg-white px-4 text-fluid-sm font-medium text-text-secondary hover:bg-neutral-100 transition-colors duration-150"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex h-ctrl items-center justify-center rounded-fluid bg-primary-500 px-4 text-fluid-sm font-medium text-white shadow-btn hover:bg-primary-600 hover:shadow-btn-hover transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Création...' : 'Create Work Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
