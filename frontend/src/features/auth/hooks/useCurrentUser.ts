import { useQuery } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
