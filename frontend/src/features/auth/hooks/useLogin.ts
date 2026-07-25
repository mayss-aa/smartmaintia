import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/features/auth/services/auth.service'
import { useAuth } from '@/store/auth/useAuth'
import type { LoginCredentials } from '@/types/auth'
import { getHomeRouteByRole } from '@/lib/navigation'

type LoginInput = LoginCredentials & { remember: boolean }

export function useLogin() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginInput) => {
      const { remember: _, ...credentials } = input
      return authService.login(credentials)
    },
    onSuccess: async (response, input) => {
      let user
      try {
        user = await authService.getCurrentUser(response.access_token)
      } catch {
        throw new Error('Profil récupéré, mais impossible de charger vos données utilisateur.')
      }
      setAuth(user, response.access_token, input.remember)
      navigate(getHomeRouteByRole(user.role), { replace: true })
    },
  })
}
