import { useState, useMemo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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
import { useTestBenches, useCreateTestBench, useUpdateTestBench, useDeleteTestBench } from '@/features/test-benches/hooks/useTestBenches'
import type { TestBench, CreateTestBenchPayload } from '@/features/test-benches/services/test-benches.service'

const statusLabels: Record<string, string> = {
  OPERATIONNEL: 'Opérationnel',
  EN_PANNE: 'En panne',
  EN_MAINTENANCE: 'En maintenance',
}

export default function TestBenches() {
  const [search, setSearch] = useState('')
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TestBench | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<TestBench | undefined>()

  const { data: benches, isLoading } = useTestBenches()
  const createMutation = useCreateTestBench()
  const updateMutation = useUpdateTestBench()
  const deleteMutation = useDeleteTestBench()

  // Inline create form state
  const [createCode, setCreateCode] = useState('')
  const [createName, setCreateName] = useState('')
  const [createLocation, setCreateLocation] = useState('')
  const [createStatus, setCreateStatus] = useState('OPERATIONNEL')
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})

  // Edit form state
  const [editCode, setEditCode] = useState('')
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editStatus, setEditStatus] = useState('OPERATIONNEL')

  const filtered = useMemo(() => {
    let list = benches ?? []
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (b) =>
          b.code_banc.toLowerCase().includes(q) ||
          b.nom.toLowerCase().includes(q) ||
          b.emplacement.toLowerCase().includes(q),
      )
    }
    return list
  }, [benches, search])

  const columns: ColumnDef<TestBench>[] = [
    { accessorKey: 'code_banc', header: 'Code', enableSorting: true },
    { accessorKey: 'nom', header: 'Nom', enableSorting: true },
    { accessorKey: 'emplacement', header: 'Emplacement', cell: ({ getValue }) => (getValue() as string) || '-' },
    {
      id: 'statut',
      header: 'Statut',
      accessorFn: (row) => statusLabels[row.statut] ?? row.statut,
      cell: ({ row }) => <StatusBadge status={row.original.statut} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const b = row.original
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(b)
                setEditCode(b.code_banc)
                setEditName(b.nom)
                setEditLocation(b.emplacement)
                setEditStatus(b.statut)
                setModalOpen(true)
              }}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary-600"
              aria-label="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteTarget(b)}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-error/10 hover:text-error"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
  ]

  function validateCreate(): boolean {
    const errs: Record<string, string> = {}
    if (!createCode.trim()) errs.code = 'Le code est obligatoire'
    if (!createName.trim()) errs.name = 'Le nom est obligatoire'
    if (!createLocation.trim()) errs.location = "L'emplacement est obligatoire"
    setCreateErrors(errs)
    return Object.keys(errs).length === 0
  }

  function resetCreateForm() {
    setCreateCode('')
    setCreateName('')
    setCreateLocation('')
    setCreateStatus('OPERATIONNEL')
    setCreateErrors({})
  }

  function handleCreate() {
    if (!validateCreate()) return
    const payload: CreateTestBenchPayload = {
      code_banc: createCode.trim(),
      nom: createName.trim(),
      emplacement: createLocation.trim(),
      statut: createStatus,
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.addToast('Banc de test créé avec succès', 'success')
        resetCreateForm()
      },
      onError: (err: Error) => {
        const msg = err.message.includes('already exists')
          ? 'Ce code banc existe déjà'
          : err.message ?? "Erreur lors de la création"
        toast.addToast(msg, 'error')
      },
    })
  }

  function handleEdit() {
    if (!editing) return
    updateMutation.mutate({
      code: editing.code_banc,
      payload: {
        nom: editName.trim(),
        emplacement: editLocation.trim(),
        statut: editStatus,
      },
    }, {
      onSuccess: () => {
        setEditing(undefined)
        setModalOpen(false)
        toast.addToast('Banc modifié', 'success')
      },
      onError: (err: Error) => toast.addToast(err?.message ?? 'Erreur', 'error'),
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.code_banc, {
      onSuccess: () => { setDeleteTarget(undefined); toast.addToast('Banc supprimé', 'success') },
      onError: (err: Error) => toast.addToast(err?.message ?? 'Erreur', 'error'),
    })
  }

  return (
    <div>
      <PageHeader
        title="Bancs de test"
        description="Gérer les bancs de test BDD"
      />

      {/* Inline create form */}
      <section className="mb-4 rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="mb-1 text-fluid-lg font-semibold text-text-primary">
          Ajouter un banc de test
        </h2>
        <p className="mb-4 text-fluid-sm text-text-secondary">
          Remplissez les champs ci-dessous pour ajouter un équipement au parc.
        </p>
        <div className="grid grid-cols-12 gap-fluid-sm">
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Code unique du banc</label>
            <input
              value={createCode}
              onChange={(e) => setCreateCode(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.code ? 'border-error' : ''}`}
            />
            {createErrors.code && <div className="mt-1 text-fluid-sm text-error">{createErrors.code}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Nom du banc</label>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.name ? 'border-error' : ''}`}
            />
            {createErrors.name && <div className="mt-1 text-fluid-sm text-error">{createErrors.name}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Emplacement dans l'usine</label>
            <input
              value={createLocation}
              onChange={(e) => setCreateLocation(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.location ? 'border-error' : ''}`}
            />
            {createErrors.location && <div className="mt-1 text-fluid-sm text-error">{createErrors.location}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Statut initial</label>
            <select
              value={createStatus}
              onChange={(e) => setCreateStatus(e.target.value)}
              className="h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="OPERATIONNEL">Opérationnel</option>
              <option value="EN_MAINTENANCE">En maintenance</option>
              <option value="EN_PANNE">En panne</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="inline-flex h-ctrl items-center justify-center rounded-fluid bg-primary-500 px-4 text-fluid-sm font-medium text-white shadow-btn hover:bg-primary-600 hover:shadow-btn-hover transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Création...' : 'Créer le banc'}
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un banc..." />
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucun banc" description="Commencez par créer un banc de test." />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={10} />
      )}

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined) }}
        title="Modifier le banc"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Code banc</label>
            <input
              value={editCode}
              disabled
              className="w-full rounded-lg border border-border bg-neutral-50 px-3 py-2 text-sm text-text-secondary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Nom</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Emplacement</label>
            <input
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Statut</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500"
            >
              <option value="OPERATIONNEL">Opérationnel</option>
              <option value="EN_MAINTENANCE">En maintenance</option>
              <option value="EN_PANNE">En panne</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setModalOpen(false); setEditing(undefined) }}
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary hover:bg-neutral-50"
            >
              Annuler
            </button>
            <button
              onClick={handleEdit}
              disabled={updateMutation.isPending}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {updateMutation.isPending ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDelete}
        title="Supprimer le banc"
        message={`Supprimer ${deleteTarget?.code_banc} - ${deleteTarget?.nom} ?`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
