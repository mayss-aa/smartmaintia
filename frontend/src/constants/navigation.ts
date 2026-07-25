import {
  LayoutDashboard,
  Users,
  TestTube,
  Ticket,
  Wrench,
  Calendar,
  Clock,
  Bell,
  UserCircle,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from './routes'
import { ROLES } from './roles'

export interface NavItem {
  id: string
  title: string
  icon: LucideIcon
  route: string
  roles: string[]
}

export const navigation: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    route: ROUTES.DASHBOARD,
    roles: [ROLES.ADMINISTRATEUR, ROLES.MANAGER_MAINTENANCE],
  },
  {
    id: 'users',
    title: 'Utilisateurs',
    icon: Users,
    route: ROUTES.USERS,
    roles: [ROLES.ADMINISTRATEUR],
  },
  {
    id: 'test-benches',
    title: 'Bancs de test',
    icon: TestTube,
    route: ROUTES.TEST_BENCHES,
    roles: [ROLES.ADMINISTRATEUR],
  },
  {
    id: 'tickets',
    title: 'Tickets',
    icon: Ticket,
    route: ROUTES.TICKETS,
    roles: [ROLES.MANAGER_MAINTENANCE, ROLES.OPERATEUR_PRODUCTION],
  },
  {
    id: 'incident',
    title: 'Déclaration incident',
    icon: AlertTriangle,
    route: ROUTES.INCIDENT,
    roles: [ROLES.OPERATEUR_PRODUCTION],
  },
  {
    id: 'interventions',
    title: 'Interventions',
    icon: Wrench,
    route: ROUTES.INTERVENTIONS,
    roles: [ROLES.MANAGER_MAINTENANCE, ROLES.TECHNICIEN],
  },
  {
    id: 'planning',
    title: 'Planning',
    icon: Calendar,
    route: ROUTES.PLANNING,
    roles: [ROLES.MANAGER_MAINTENANCE, ROLES.TECHNICIEN],
  },
  {
    id: 'history',
    title: 'Historique',
    icon: Clock,
    route: ROUTES.HISTORY,
    roles: [ROLES.ADMINISTRATEUR, ROLES.TECHNICIEN],
  },
  {
    id: 'alerts',
    title: 'Alertes Prédictives',
    icon: Bell,
    route: ROUTES.ALERTS,
    roles: [ROLES.MANAGER_MAINTENANCE],
  },
  {
    id: 'profile',
    title: 'Profil',
    icon: UserCircle,
    route: ROUTES.PROFILE,
    roles: [ROLES.ADMINISTRATEUR, ROLES.TECHNICIEN, ROLES.OPERATEUR_PRODUCTION],
  },
]
