import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Trash2, Wrench } from 'lucide-react'
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
import { useTickets, useCreateTicket, useDeleteTicket } from '@/features/tickets/hooks/useTickets'
import { useTestBenches } from '@/features/test-benches/hooks/useTestBenches'
import type { TestBench } from '@/features/test-benches/services/test-benches.service'
import type { Ticket, CreateTicketPayload } from '@/types/ticket'
import { useAuth } from '@/store/auth/useAuth'
import { ROLES } from '@/constants/roles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const ticketSchema = z.object({
  code_banc: z.string().min(1, 'Le banc est obligatoire'),
  symptome: z.string().min(1, 'Le symptôme est obligatoire'),
  criticite: z.string().optional(),
})

export default function Tickets() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailTarget, setDetailTarget] = useState<Ticket | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Ticket | undefined>()
  const { user } = useAuth()
  const isOperator = user?.role === ROLES.OPERATEUR_PRODUCTION
  const isManager = user?.role === ROLES.MANAGER_MAINTENANCE
  const isAdmin = user?.role === ROLES.ADMINISTRATEUR
  const canCreate = isOperator
  const canDelete = isAdmin
  const toast = useToast()

  const { data: tickets, isLoading } = useTickets()
  const { data: benches, isLoading: benchesLoading, isError: benchesError } = useTestBenches()
  const createMutation = useCreateTicket()
  const deleteMutation = useDeleteTicket()

  const benchOptionLabel = (b: TestBench) => {
    const code = b.code_banc
    const nom = b.nom
    return nom ? `${code} — ${nom}` : code
  }

  const createForm = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: { code_banc: '', symptome: '', criticite: 'MOYENNE' },
  })

  const filtered = (tickets ?? []).filter((t) =>
    (t.symptome ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnDef<Ticket>[] = [
    { accessorKey: 'id_ticket', header: 'ID' },
    { accessorKey: 'symptome', header: 'Symptôme', cell: ({ getValue }) => {
      const desc = getValue() as string
      return desc.length > 60 ? desc.slice(0, 60) + '...' : desc
    }},
    { accessorKey: 'statut', header: 'Statut', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'criticite', header: 'Criticité' },
    { accessorKey: 'date_creation', header: 'Date', cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('fr-FR') },
    {
      accessorKey: 'id_ticket', header: 'Actions', cell: ({ getValue }) => {
        const id = getValue() as number
        const ticket = tickets?.find((t) => t.id_ticket === id)
        if (!ticket) return null
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => setDetailTarget(ticket)} className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary-600" aria-label="Détail"><Eye className="h-4 w-4" /></button>
            {isManager && (
              <button onClick={() => navigate(`/interventions/new?ticketId=${ticket.id_ticket}`)} className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary-600" aria-label="Créer une intervention"><Wrench className="h-4 w-4" /></button>
            )}
            {canDelete && (
              <button onClick={() => setDeleteTarget(ticket)} className="rounded-lg p-1.5 text-text-secondary hover:bg-error/10 hover:text-error" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader title={isOperator ? 'Mes déclarations' : 'Tickets'} description={isManager ? 'Consultation des tickets' : isOperator ? 'Consultez le suivi des déclarations que vous avez envoyées.' : 'Gestion des tickets de maintenance'} actions={
        canCreate && <button onClick={() => { createForm.reset({ code_banc: '', symptome: '', criticite: 'MOYENNE' }); setCreateOpen(true) }} className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"><Plus className="h-4 w-4" />Nouvelle déclaration</button>
      } />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder={isOperator ? 'Rechercher une déclaration...' : 'Rechercher un ticket...'} /></div>
      {isLoading ? <div className="flex h-48 items-center justify-center"><Loader /></div> :
        filtered.length === 0 ? <EmptyState title={isOperator ? 'Aucune déclaration' : 'Aucun ticket'} /> :
        <DataTable columns={columns} data={filtered} pageSize={10} />}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nouvelle déclaration" description="Déclarer une panne sur un banc de test.">
        <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data as CreateTicketPayload, {
          onSuccess: () => { setCreateOpen(false); createForm.reset(); toast.addToast(isOperator ? 'Déclaration envoyée avec succès' : 'Ticket créé avec succès', 'success') },
          onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la déclaration', 'error'),
        }))} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Banc de test *</label>
            {benchesLoading ? (
              <p className="text-sm text-text-secondary">Chargement des bancs...</p>
            ) : benchesError ? (
              <p className="text-sm text-error">Impossible de charger la liste des bancs.</p>
            ) : (
              <select {...createForm.register('code_banc')} className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 ${createForm.formState.errors.code_banc ? 'border-error' : 'border-border'}`}>
                <option value="">Sélectionner un banc</option>
                {(benches ?? []).map((b) => (
                  <option key={b.code_banc} value={b.code_banc}>{benchOptionLabel(b)}</option>
                ))}
              </select>
            )}
            {createForm.formState.errors.code_banc && <p className="mt-1 text-xs text-error">{createForm.formState.errors.code_banc.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Symptôme</label>
            <textarea {...createForm.register('symptome')} rows={4} className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 ${createForm.formState.errors.symptome ? 'border-error' : 'border-border'}`} />
            {createForm.formState.errors.symptome && <p className="mt-1 text-xs text-error">{createForm.formState.errors.symptome.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Criticité</label>
            <select {...createForm.register('criticite')} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary hover:bg-neutral-50">Annuler</button>
            <button type="submit" disabled={createMutation.isPending || benchesLoading || benchesError || (benches ?? []).length === 0} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">{isOperator ? 'Déclarer' : 'Créer'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!detailTarget} onClose={() => setDetailTarget(undefined)} title={isOperator ? `Déclaration n°${detailTarget?.id_ticket}` : `Ticket #${detailTarget?.id_ticket}`} size="sm">
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div><span className="font-medium text-text-secondary">{isOperator ? 'Description' : 'Symptôme'} :</span><p className="mt-1 text-text-primary">{detailTarget.symptome}</p></div>
            <div className="flex gap-4">
              <div><span className="font-medium text-text-secondary">Statut :</span><div className="mt-1"><StatusBadge status={detailTarget.statut} /></div></div>
              <div><span className="font-medium text-text-secondary">Criticité :</span><p className="mt-1 text-text-primary">{detailTarget.criticite}</p></div>
            </div>
            <div><span className="font-medium text-text-secondary">Banc :</span><p className="mt-1 text-text-primary">{detailTarget.code_banc}</p></div>
            {detailTarget.banc_nom && <div><span className="font-medium text-text-secondary">Nom banc :</span><p className="mt-1 text-text-primary">{detailTarget.banc_nom}</p></div>}
            <div><span className="font-medium text-text-secondary">Date :</span><p className="mt-1 text-text-primary">{new Date(detailTarget.date_creation).toLocaleDateString('fr-FR')}</p></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(undefined)} onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id_ticket, {
        onSuccess: () => { setDeleteTarget(undefined); toast.addToast(isOperator ? 'Déclaration supprimée' : 'Ticket supprimé', 'success') },
        onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la suppression', 'error'),
      })} title={isOperator ? 'Supprimer la déclaration' : 'Supprimer le ticket'} message={isOperator ? 'Cette action est irréversible.' : 'Cette action est irréversible.'} confirmLabel="Supprimer" isLoading={deleteMutation.isPending} />
    </div>
  )
}