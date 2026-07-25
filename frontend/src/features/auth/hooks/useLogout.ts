import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/auth/useAuth'
import { ROUTES } from '@/constants/routes'

export function useLogout() {
  const { clearAuth } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = useCallback(() => {
    queryClient.clear()
    clearAuth()
    navigate(ROUTES.LOGIN, { replace: true })
  }, [queryClient, clearAuth, navigate])

  return logout
}
