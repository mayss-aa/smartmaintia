import { useLocation, Link } from 'react-router-dom'
import { navigation } from '@/constants/navigation'
import { useAuth } from '@/store/auth/useAuth'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import { Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.USERS]: 'Utilisateurs',
  [ROUTES.TEST_BENCHES]: 'Bancs de test',
  [ROUTES.TICKETS]: 'Tickets',
  [ROUTES.INTERVENTIONS]: 'Interventions',
  [ROUTES.PLANNING]: 'Planning',
  [ROUTES.HISTORY]: 'Historique',
  [ROUTES.ALERTS]: 'Alertes',
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.INCIDENT]: 'Déclaration d\'incident',
}

export function Breadcrumb() {
  const location = useLocation()
  const { user } = useAuth()

  const navItem = navigation.find((item) => item.route === location.pathname)
  const label = routeLabels[location.pathname] ?? navItem?.title ?? 'Page'

  const isOperator = user?.role === ROLES.OPERATEUR_PRODUCTION

  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm">
      {user && !isOperator ? (
        <Link
          to="/"
          className="flex items-center gap-1 text-text-secondary hover:text-primary-600"
        >
          <Home className="h-4 w-4" />
          <span>Accueil</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 text-text-secondary">
          <Home className="h-4 w-4" />
          <span>Accueil</span>
        </span>
      )}
      {!isOperator && <span className="text-text-secondary">/</span>}
      <span className="font-medium text-text-primary">{label}</span>
    </nav>
  )
}
