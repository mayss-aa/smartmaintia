import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth/useAuth'
import { navigation } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { ROLES } from '@/constants/roles'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ mobileOpen, onCloseMobile, collapsed, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()

  const isTechnician = user?.role === ROLES.TECHNICIEN
  const isOperator = user?.role === ROLES.OPERATEUR_PRODUCTION

  const visibleItems = navigation.filter(
    (item) => user && item.roles.includes(user.role),
  )

  const technicianLabels: Record<string, string> = {
    interventions: 'Mes interventions',
    planning: 'Mon planning',
    history: 'Mon historique',
    profile: 'Mon profil',
  }

  const operatorLabels: Record<string, string> = {
    incident: 'Déclaration de panne',
    tickets: 'Mes déclarations',
    profile: 'Mon profil',
  }

  const getItemLabel = (item: typeof navigation[number]) =>
    isTechnician
      ? (technicianLabels[item.id] ?? item.title)
      : isOperator
        ? (operatorLabels[item.id] ?? item.title)
        : item.title

  useEffect(() => {
    if (mobileOpen && onCloseMobile) onCloseMobile()
  }, [location.pathname])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed top-0 left-0 w-full h-screen md:hidden"
          style={{ zIndex: 1040, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'flex-col border-r border-border',
          mobileOpen
            ? 'fixed top-0 left-0 flex'
            : 'hidden md:flex',
        )}
        style={{
          width: mobileOpen ? 280 : collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
          zIndex: mobileOpen ? 1050 : undefined,
          background: '#fff',
          height: mobileOpen ? '100vh' : undefined,
          transition: 'width 0.2s ease',
        }}
      >
        {/* HEADER: logo + text + chevron (expanded), or logo + chevron below (collapsed) */}
        {!collapsed ? (
          <div className="flex h-header shrink-0 items-center gap-2.5 border-b border-border px-fluid-xs">
            <Link
              to={isOperator ? '#' : '/'}
              className="flex items-center no-underline gap-2.5 min-w-0 flex-1"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-fluid-base font-bold text-white">
                S
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-fluid-sm font-bold leading-tight text-text-primary">
                  SmartMaint IA
                </p>
                <p className="truncate text-fluid-xs leading-tight text-text-secondary">
                  Maintenance industrielle
                </p>
              </div>
            </Link>
            <button
              onClick={onToggleCollapse}
              aria-label="Réduire le menu"
              className="shrink-0 rounded-md p-1 text-text-secondary hover:bg-neutral-100"
            >
              <ChevronLeft style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center border-b border-border shrink-0 pt-2 pb-1">
            <Link
              to={isOperator ? '#' : '/'}
              className="flex items-center justify-center no-underline"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-fluid-base font-bold text-white">
                S
              </div>
            </Link>
            <button
              onClick={onToggleCollapse}
              aria-label="Déplier le menu"
              className="mt-1 shrink-0 rounded-md p-1.5 text-text-secondary hover:bg-neutral-100"
            >
              <ChevronRight style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
            </button>
          </div>
        )}

        <nav className={cn(
          'flex-1 overflow-auto py-2',
          collapsed ? 'px-2' : 'px-3',
        )}>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.route
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.route}
                className={cn(
                  'flex items-center no-underline rounded-fluid py-2 transition-all duration-150',
                  collapsed
                    ? 'justify-center mb-1'
                    : 'gap-3 px-3 mb-1',
                  isActive
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-text-secondary',
                  !isActive && !collapsed ? 'hover-lift' : '',
                )}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? getItemLabel(item) : undefined}
                style={!isActive && !collapsed ? { transition: 'all 0.15s ease' } : undefined}
                onMouseEnter={(e) => {
                  if (!isActive && !collapsed) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.03)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !collapsed) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }
                }}
              >
                <Icon className="shrink-0" size={20} />
                {!collapsed && (
                  <span className="text-fluid-sm font-medium">
                    {getItemLabel(item)}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto rounded-full bg-primary-500" style={{ width: 8, height: 8 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-border py-3 px-3 shrink-0">
            <p className="mb-0 text-center text-text-secondary" style={{ fontSize: '0.75rem' }}>
              v1.0.0 &copy; SmartMaint IA
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
