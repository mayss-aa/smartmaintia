import { useAuth } from '@/store/auth/useAuth'
import { ROLES } from '@/constants/roles'
import { StatusBadge } from '@/components/common/StatusBadge'
import { User, Mail, Shield } from 'lucide-react'

const roleLabels: Record<string, string> = {
  [ROLES.ADMINISTRATEUR]: 'Administrateur',
  [ROLES.MANAGER_MAINTENANCE]: 'Manager Maintenance',
  [ROLES.TECHNICIEN]: 'Technicien',
  [ROLES.OPERATEUR_PRODUCTION]: 'Opérateur Production',
}

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="mx-auto px-0 sm:px-3" style={{ maxWidth: '720px' }}>
      <div className="mb-4">
        <h1 className="text-fluid-2xl font-bold text-text-primary">Profil</h1>
        <p className="mt-1 text-fluid-sm text-text-secondary">Informations de l'utilisateur connecté</p>
      </div>

      <div className="rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center rounded-full text-2xl font-bold shrink-0" style={{ width: 64, height: 64, backgroundColor: 'rgba(37,99,235,0.1)', color: 'var(--color-primary-500)' }}>
            {user.prenom?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-fluid-xl font-semibold font-bold text-text-primary">
              {user.prenom} {user.nom}
            </h2>
            <StatusBadge status={roleLabels[user.role] ?? user.role} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-fluid border border-border bg-neutral-100 p-3">
            <Mail className="h-5 w-5 text-text-secondary shrink-0" />
            <div className="min-w-0">
              <p className="mb-0 text-fluid-sm text-text-secondary">Email</p>
              <p className="mb-0 text-fluid-sm font-medium text-text-primary truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-fluid border border-border bg-neutral-100 p-3">
            <Shield className="h-5 w-5 text-text-secondary shrink-0" />
            <div>
              <p className="mb-0 text-fluid-sm text-text-secondary">Rôle</p>
              <p className="mb-0 text-fluid-sm font-medium text-text-primary">
                {roleLabels[user.role] ?? user.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-fluid border border-border bg-neutral-100 p-3">
            <User className="h-5 w-5 text-text-secondary shrink-0" />
            <div>
              <p className="mb-0 text-fluid-sm text-text-secondary">Identifiant</p>
              <p className="mb-0 text-fluid-sm font-medium text-text-primary">#{user.id_user}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
