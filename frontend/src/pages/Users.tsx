import { useState, useMemo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/table/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { Modal } from '@/components/common/Modal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { UserForm } from '@/features/users/components/UserForm'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useToast } from '@/components/feedback/Toast'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/users/hooks/useUsers'
import type { User, CreateUserPayload } from '@/types/user'
import { ROLES } from '@/constants/roles'

const roleLabels: Record<string, string> = {
  [ROLES.ADMINISTRATEUR]: 'Administrateur',
  [ROLES.MANAGER_MAINTENANCE]: 'Manager Maintenance',
  [ROLES.TECHNICIEN]: 'Technicien',
  [ROLES.OPERATEUR_PRODUCTION]: 'Opérateur Production',
}

export default function Users() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<User | undefined>()

  const { data: users, isLoading } = useUsers()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  // Inline create form state
  const [createName, setCreateName] = useState('')
  const [createSurname, setCreateSurname] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createConfirm, setCreateConfirm] = useState('')
  const [createRole, setCreateRole] = useState('')
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let list = users ?? []
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.nom.toLowerCase().includes(q) ||
          u.prenom.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }
    if (roleFilter) {
      list = list.filter((u) => u.role === roleFilter)
    }
    return list
  }, [users, search, roleFilter])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'prenom',
      header: 'Prénom',
      enableSorting: true,
    },
    {
      accessorKey: 'nom',
      header: 'Nom',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'role',
      header: 'Rôle',
      accessorFn: (row) => roleLabels[row.role] ?? row.role,
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingUser(u)
                setModalOpen(true)
              }}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-600"
              aria-label="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteTarget(u)}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-error/10 hover:text-error"
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
    if (!createName.trim()) errs.nom = 'Le nom est obligatoire'
    if (!createSurname.trim()) errs.prenom = 'Le prénom est obligatoire'
    if (!createEmail.trim()) errs.email = "L'email est obligatoire"
    else if (!/\S+@\S+\.\S+/.test(createEmail)) errs.email = "Format d'email invalide"
    if (!createPassword) errs.password = 'Le mot de passe est obligatoire'
    else if (createPassword.length < 6) errs.password = 'Minimum 6 caractères'
    if (createPassword !== createConfirm) errs.confirm = 'Les mots de passe ne correspondent pas'
    if (!createRole) errs.role = 'Le rôle est obligatoire'
    setCreateErrors(errs)
    return Object.keys(errs).length === 0
  }

  function resetCreateForm() {
    setCreateName('')
    setCreateSurname('')
    setCreateEmail('')
    setCreatePassword('')
    setCreateConfirm('')
    setCreateRole('')
    setCreateErrors({})
  }

  function handleCreate() {
    if (!validateCreate()) return
    const payload: CreateUserPayload = {
      nom: createName.trim(),
      prenom: createSurname.trim(),
      email: createEmail.trim(),
      password: createPassword,
      role: createRole as CreateUserPayload['role'],
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.addToast('Utilisateur créé avec succès', 'success')
        resetCreateForm()
      },
      onError: (err: Error) => {
        const msg = err.message.includes('409')
          ? 'Cet email est déjà utilisé'
          : err.message ?? "Erreur lors de la création"
        toast.addToast(msg, 'error')
      },
    })
  }

  const handleUpdate = (data: Record<string, string | undefined>) => {
    if (!editingUser) return
    const { password: _, ...payload } = data
    updateMutation.mutate(
      { id: editingUser.id_user, payload: payload as Parameters<typeof updateMutation.mutate>[0]['payload'] },
      { onSuccess: () => {
        setEditingUser(undefined)
        setModalOpen(false)
        toast.addToast('Utilisateur modifié', 'success')
      },
      onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
      },
    )
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id_user, {
      onSuccess: () => { setDeleteTarget(undefined); toast.addToast('Utilisateur supprimé', 'success') },
      onError: (err) => toast.addToast(err?.message ?? 'Erreur', 'error'),
    })
  }

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        description="Gérer les utilisateurs de la plateforme"
      />

      {/* Inline create form */}
      <section className="mb-4 rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="mb-1 text-fluid-lg font-semibold text-text-primary">
          Créer un nouvel utilisateur
        </h2>
        <p className="mb-4 text-fluid-sm text-text-secondary">
          Remplissez les champs ci-dessous pour ajouter un utilisateur.
        </p>
        <div className="grid grid-cols-12 gap-fluid-sm">
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Nom</label>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.nom ? 'border-error' : ''}`}
            />
            {createErrors.nom && <div className="mt-1 text-fluid-sm text-error">{createErrors.nom}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Prénom</label>
            <input
              value={createSurname}
              onChange={(e) => setCreateSurname(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.prenom ? 'border-error' : ''}`}
            />
            {createErrors.prenom && <div className="mt-1 text-fluid-sm text-error">{createErrors.prenom}</div>}
          </div>
          <div className="col-span-12">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Email</label>
            <input
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.email ? 'border-error' : ''}`}
            />
            {createErrors.email && <div className="mt-1 text-fluid-sm text-error">{createErrors.email}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Mot de passe</label>
            <input
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.password ? 'border-error' : ''}`}
            />
            {createErrors.password && <div className="mt-1 text-fluid-sm text-error">{createErrors.password}</div>}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Confirmation du mot de passe</label>
            <input
              type="password"
              value={createConfirm}
              onChange={(e) => setCreateConfirm(e.target.value)}
              className={`h-ctrl w-full rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.confirm ? 'border-error' : ''}`}
            />
            {createErrors.confirm && <div className="mt-1 text-fluid-sm text-error">{createErrors.confirm}</div>}
          </div>
          <div className="col-span-12">
            <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">Rôle</label>
            <select
              value={createRole}
              onChange={(e) => setCreateRole(e.target.value)}
              className={`h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${createErrors.role ? 'border-error' : ''}`}
            >
              <option value="">Sélectionner un rôle</option>
              <option value={ROLES.ADMINISTRATEUR}>Administrateur</option>
              <option value={ROLES.MANAGER_MAINTENANCE}>Manager Maintenance</option>
              <option value={ROLES.TECHNICIEN}>Technicien</option>
              <option value={ROLES.OPERATEUR_PRODUCTION}>Opérateur Production</option>
            </select>
            {createErrors.role && <div className="mt-1 text-fluid-sm text-error">{createErrors.role}</div>}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="inline-flex h-ctrl items-center justify-center rounded-fluid bg-primary-500 px-4 text-fluid-sm font-medium text-white shadow-btn hover:bg-primary-600 hover:shadow-btn-hover transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Création...' : "Créer l'utilisateur"}
          </button>
        </div>
      </section>

      {/* Search + role filter */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un utilisateur..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-ctrl w-auto appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        >
          <option value="">Tous les rôles</option>
          {Object.entries(roleLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucun utilisateur"
          description="Commencez par créer un nouvel utilisateur."
        />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={10} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingUser(undefined)
        }}
        title="Modifier l'utilisateur"
        description={
          editingUser
            ? `Modification de ${editingUser.prenom} ${editingUser.nom}`
            : undefined
        }
      >
        <UserForm
          user={editingUser}
          onSubmit={(data) => handleUpdate(data)}
          onCancel={() => {
            setModalOpen(false)
            setEditingUser(undefined)
          }}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.prenom} ${deleteTarget?.nom} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
