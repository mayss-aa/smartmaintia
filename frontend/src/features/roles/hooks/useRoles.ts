import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/features/roles/services/roles.service'

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAll(),
  })
}
