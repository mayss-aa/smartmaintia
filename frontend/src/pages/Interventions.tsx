import { useState } from 'react'
import { Play, CheckCircle, Eye, Trash2, ThumbsUp, ThumbsDown, Mic } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/table/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/common/Modal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useToast } from '@/components/feedback/Toast'
import { useInterventions, useMyInterventions, useUpdateIntervention, useDeleteIntervention, useStartIntervention, useCompleteIntervention } from '@/features/interventions/hooks/useInterventions'
import type { Intervention, UpdateInterventionPayload, CompleteInterventionPayload } from '@/types/intervention'
import { useAuth } from '@/store/auth/useAuth'
import { ROLES } from '@/constants/roles'
import { InterventionStatus } from '@/constants/interventionStatus'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const reportSchema = z.object({
  rapport: z.string().min(1, 'Le rapport est obligatoire'),
  actions_realisees: z.string().optional(),
  pieces_utilisees: z.string().optional(),
})

export default function Interventions() {
  const [search, setSearch] = useState('')
  const [detailTarget, setDetailTarget] = useState<Intervention | undefined>()
  const [reportTarget, setReportTarget] = useState<Intervention | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Intervention | undefined>()
  const [isRecording, setIsRecording] = useState(false)
  const { user } = useAuth()
  const isTechnician = user?.role === ROLES.TECHNICIEN
  const isManager = user?.role === ROLES.MANAGER_MAINTENANCE
  const toast = useToast()

  const allQuery = useInterventions()
  const myQuery = useMyInterventions()
  const interventions = isTechnician ? myQuery.data : allQuery.data
  const isLoading = isTechnician ? myQuery.isLoading : allQuery.isLoading
  const isError = isTechnician ? myQuery.isError : allQuery.isError
  const updateMutation = useUpdateIntervention()
  const deleteMutation = useDeleteIntervention()
  const startMutation = useStartIntervention()
  const completeMutation = useCompleteIntervention()

  const reportForm = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { rapport: '', actions_realisees: '', pieces_utilisees: '' },
  })
  const watchRapport = reportForm.watch('rapport') || ''
  const watchActions = reportForm.watch('actions_realisees') || ''

  const typeLabels: Record<string, string> = {
    CURATIF: 'Curatif',
    PREVENTIF: 'Préventif',
    PREDICTIF: 'Prédictif',
  }

  const filtered = (interventions ?? []).filter(
    (i) =>
      (i.ticket_code_banc ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (i.technicien_nom ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnDef<Intervention>[] = [
    { accessorKey: 'id_intervention', header: 'ID' },
    {
      accessorKey: 'type', header: 'Type',
      cell: ({ getValue }) => typeLabels[getValue() as string] ?? (getValue() as string),
    },
    {
      accessorKey: 'date_planifiee', header: 'Date planifiée',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('fr-FR'),
    },
    { accessorKey: 'statut_intervention', header: 'Statut', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    ...(isTechnician ? [] : [{ accessorKey: 'technicien_nom', header: 'Technicien', cell: ({ getValue }: { getValue: () => unknown }) => (getValue() as string) || 'Non assigné' }]),
    { accessorKey: 'ticket_code_banc', header: 'Banc', cell: ({ getValue }) => (getValue() as string) || '-' },
    {
      accessorKey: 'id_intervention', header: 'Actions', cell: ({ getValue }) => {
        const id = getValue() as number
        const intervention = interventions?.find((i) => i.id_intervention === id)
        if (!intervention) return null
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => setDetailTarget(intervention)} className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary-600" aria-label="Détail"><Eye className="h-4 w-4" /></button>
            {isTechnician && intervention.statut_intervention === InterventionStatus.PLANIFIEE && (
              <button onClick={() => startMutation.mutate(intervention.id_intervention, {
                onSuccess: () => toast.addToast('Intervention commencée', 'success'),
                onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
              })} className="rounded-lg p-1.5 text-text-secondary hover:bg-success/10 hover:text-success" aria-label="Commencer"><Play className="h-4 w-4" /></button>
            )}
            {isTechnician && intervention.statut_intervention === InterventionStatus.EN_COURS && (
              <button onClick={() => { setReportTarget(intervention); reportForm.reset({ rapport: '', actions_realisees: '', pieces_utilisees: '' }) }} className="rounded-lg p-1.5 text-text-secondary hover:bg-success/10 hover:text-success" aria-label="Terminer"><CheckCircle className="h-4 w-4" /></button>
            )}
            {isManager && intervention.statut_intervention === InterventionStatus.TERMINEE && (
              <>
                <button onClick={() => updateMutation.mutate({ id: intervention.id_intervention, payload: { statut_intervention: InterventionStatus.VALIDEE } as UpdateInterventionPayload }, {
                  onSuccess: () => toast.addToast('Intervention validée', 'success'),
                  onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la validation', 'error'),
                })} className="rounded-lg p-1.5 text-text-secondary hover:bg-success/10 hover:text-success" aria-label="Valider"><ThumbsUp className="h-4 w-4" /></button>
                <button onClick={() => updateMutation.mutate({ id: intervention.id_intervention, payload: { statut_intervention: InterventionStatus.REJETEE } as UpdateInterventionPayload }, {
                  onSuccess: () => toast.addToast('Intervention rejetée', 'success'),
                  onError: (err) => toast.addToast(err?.message ?? 'Erreur lors du rejet', 'error'),
                })} className="rounded-lg p-1.5 text-text-secondary hover:bg-error/10 hover:text-error" aria-label="Rejeter"><ThumbsDown className="h-4 w-4" /></button>
              </>
            )}
            {!isTechnician && (
              <button onClick={() => setDeleteTarget(intervention)} className="rounded-lg p-1.5 text-text-secondary hover:bg-error/10 hover:text-error" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader title={isTechnician ? 'Mes interventions' : 'Interventions'} description={isTechnician ? 'Consultez et exécutez les interventions qui vous sont assignées.' : 'Gestion des interventions'} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Rechercher une intervention..." /></div>
      {isLoading ? <div className="flex h-48 items-center justify-center"><Loader /></div> :
        isError ? <EmptyState title="Erreur de chargement" description="Impossible de charger les interventions." /> :
        filtered.length === 0 ? <EmptyState title="Aucune intervention" /> :
        <DataTable columns={columns} data={filtered} pageSize={10} />}

      <Modal open={!!detailTarget} onClose={() => setDetailTarget(undefined)} title={`Intervention #${detailTarget?.id_intervention}`} size="sm">
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div className="flex gap-4">
              <div><span className="font-medium text-text-secondary">Type :</span><p className="mt-1 text-text-primary">{typeLabels[detailTarget.type] ?? detailTarget.type}</p></div>
              <div><span className="font-medium text-text-secondary">Statut :</span><div className="mt-1"><StatusBadge status={detailTarget.statut_intervention} /></div></div>
            </div>
            <div><span className="font-medium text-text-secondary">Date planifiée :</span><p className="mt-1 text-text-primary">{new Date(detailTarget.date_planifiee).toLocaleDateString('fr-FR')}</p></div>
            {detailTarget.duree_reparation && <div><span className="font-medium text-text-secondary">Durée (min) :</span><p className="mt-1 text-text-primary">{detailTarget.duree_reparation}</p></div>}
            <div><span className="font-medium text-text-secondary">Technicien :</span><p className="mt-1 text-text-primary">{detailTarget.technicien_nom ?? (detailTarget.technicien_prenom ? `${detailTarget.technicien_prenom} ${detailTarget.technicien_nom ?? ''}` : '-')}</p></div>
            <div><span className="font-medium text-text-secondary">Banc :</span><p className="mt-1 text-text-primary">{detailTarget.ticket_code_banc ?? '-'}</p></div>
            {detailTarget.rapport_clean_ia && (
              <div><span className="font-medium text-text-secondary">Rapport technique :</span><p className="mt-1 whitespace-pre-wrap text-text-primary">{detailTarget.rapport_clean_ia}</p></div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!reportTarget}
        onClose={() => { setReportTarget(undefined); setIsRecording(false) }}
        title="Achèvement d'intervention"
        description="Saisissez le rapport technique avant de clôturer l'intervention."
        size="xl"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => { setReportTarget(undefined); setIsRecording(false) }}
              disabled={completeMutation.isPending}
              className="rounded-lg border border-border bg-white px-4 py-2 text-fluid-sm font-medium text-text-primary transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="complete-intervention-form"
              disabled={completeMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-fluid-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {completeMutation.isPending && <Loader size="sm" className="border-white" />}
              {completeMutation.isPending ? 'Enregistrement...' : "Terminer l'intervention"}
            </button>
          </div>
        }
      >
        <form
          id="complete-intervention-form"
          onSubmit={reportForm.handleSubmit((data) => {
            if (!reportTarget) return
            const payload: CompleteInterventionPayload = {
              rapport: data.rapport,
              actions_realisees: data.actions_realisees || undefined,
            }
            completeMutation.mutate({ id: reportTarget.id_intervention, payload }, {
              onSuccess: () => { setReportTarget(undefined); toast.addToast('Intervention terminée', 'success') },
              onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
            })
          })}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50/50 p-3">
            <Mic className="h-4 w-4 shrink-0 text-primary-600" />
            <div className="min-w-0 flex-1">
              <p className="text-fluid-sm font-medium text-text-primary">Dictée vocale</p>
              <p className="text-fluid-xs text-text-secondary">Utilisez la reconnaissance vocale pour dicter votre rapport technique.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecording((prev) => !prev)}
              className="shrink-0 rounded-md border border-primary-200 bg-white px-2.5 py-1 text-fluid-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
            >
              <Mic className="mr-1 inline-block h-3 w-3" />
              {isRecording ? 'Masquer' : 'Simuler'}
            </button>
            {isRecording && (
              <p className="text-fluid-xs text-text-secondary">Fonctionnalité disponible prochainement.</p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-fluid-sm font-medium text-text-primary">
                Rapport technique <span className="text-error">*</span>
              </label>
              <span className="text-fluid-xs text-text-secondary">{watchRapport.length}/1000</span>
            </div>
            <p className="mb-2 text-fluid-xs text-text-secondary">Décrivez les opérations de maintenance réalisées.</p>
            <textarea
              {...reportForm.register('rapport')}
              rows={3}
              maxLength={1000}
              className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-fluid-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 ${reportForm.formState.errors.rapport ? 'border-error' : 'border-border'}`}
              placeholder="Ex: Remplacement du roulement, contrôle des alignements, test de fonctionnement..."
            />
            {reportForm.formState.errors.rapport && (
              <p className="mt-1.5 text-fluid-xs text-error">{reportForm.formState.errors.rapport.message as string}</p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-fluid-sm font-medium text-text-primary">Actions réalisées</label>
              <span className="text-fluid-xs text-text-secondary">{watchActions.length}/1000</span>
            </div>
            <p className="mb-2 text-fluid-xs text-text-secondary">Listez les actions entreprises lors de l'intervention.</p>
            <textarea
              {...reportForm.register('actions_realisees')}
              rows={3}
              maxLength={1000}
              className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-fluid-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
              placeholder="Ex: Démontage du carter, remplacement du joint, remontage et test d'étanchéité..."
            />
          </div>

          <div>
            <label className="mb-1 block text-fluid-sm font-medium text-text-primary">Pièces utilisées</label>
            <p className="mb-2 text-fluid-xs text-text-secondary">Séparez les pièces par des virgules.</p>
            <input
              {...reportForm.register('pieces_utilisees')}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-fluid-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
              placeholder="Ex: Filtre à huile, Joint, Visserie, Courroie"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(undefined)} onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id_intervention, {
        onSuccess: () => { setDeleteTarget(undefined); toast.addToast('Intervention supprimée', 'success') },
        onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la suppression', 'error'),
      })} title="Supprimer l'intervention" message={`Supprimer l'intervention #${deleteTarget?.id_intervention} ?`} confirmLabel="Supprimer" isLoading={deleteMutation.isPending} />
    </div>
  )
}