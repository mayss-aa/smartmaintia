import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth/useAuth'
import { ROUTES } from '@/constants/routes'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  allowedRoles?: string[]
  children?: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
