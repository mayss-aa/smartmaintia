import { useAuth } from '@/store/auth/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { LogOut, Bell, User, Menu } from 'lucide-react'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'

interface TopbarProps {
  onMenuToggle: () => void
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <header className="flex items-center px-4 lg:px-6 py-0 border-b border-border" style={{ minHeight: '72px', boxShadow: 'var(--shadow-navbar, 0 1px 3px rgba(0,0,0,0.04))' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-ctrl w-ctrl items-center justify-center rounded-fluid text-text-secondary hover:bg-neutral-100 md:hidden"
          type="button"
          aria-label="Menu"
          aria-expanded="false"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          className="relative flex h-ctrl w-ctrl items-center justify-center rounded-fluid text-text-secondary hover:bg-neutral-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 mt-1 mr-1 rounded-full" style={{ width: 8, height: 8, backgroundColor: 'var(--color-error)' }} />
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-3">
          <div className="flex items-center justify-center rounded-full bg-primary-500/10" style={{ width: 32, height: 32 }}>
            <span className="text-fluid-sm font-semibold text-primary-500">
              {user?.prenom?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="mb-0 text-fluid-sm font-medium text-text-primary">
              {user?.prenom} {user?.nom}
            </p>
            <p className="mb-0 text-fluid-sm text-text-secondary">
              {user?.role === 'ADMINISTRATEUR'
                ? 'Administrateur'
                : user?.role === 'MANAGER_MAINTENANCE'
                  ? 'Manager Maintenance'
                  : user?.role === 'TECHNICIEN'
                    ? 'Technicien'
                    : 'Opérateur Production'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex h-ctrl w-ctrl items-center justify-center rounded-fluid text-text-secondary hover:bg-neutral-100"
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
