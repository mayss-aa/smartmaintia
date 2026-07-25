import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

const roleHomeRouteMap: Record<string, string> = {
  [ROLES.ADMINISTRATEUR]: ROUTES.DASHBOARD,
  [ROLES.MANAGER_MAINTENANCE]: ROUTES.DASHBOARD,
  [ROLES.TECHNICIEN]: ROUTES.INTERVENTIONS,
  [ROLES.OPERATEUR_PRODUCTION]: ROUTES.INCIDENT,
}

export function getHomeRouteByRole(role: string | null): string {
  if (!role) return ROUTES.LOGIN
  return roleHomeRouteMap[role] ?? ROUTES.DASHBOARD
}
