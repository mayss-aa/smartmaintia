import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '@/features/auth/services/auth.service'
import type { User } from '@/types/auth'

function getItem(key: string): string | null {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key)
}

function getStoredUser(): User | null {
  try {
    const stored = getItem('currentUser')
    return stored ? (JSON.parse(stored) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [accessToken, setAccessToken] = useState<string | null>(
    () => getItem('access_token'),
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getItem('access_token')
    if (token) {
      authService
        .getCurrentUser()
        .then((currentUser) => {
          setUser(currentUser)
          const storage = sessionStorage.getItem('access_token') ? sessionStorage : localStorage
          storage.setItem('currentUser', JSON.stringify(currentUser))
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('currentUser')
          sessionStorage.removeItem('access_token')
          sessionStorage.removeItem('currentUser')
          setUser(null)
          setAccessToken(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const setAuth = useCallback((newUser: User, token: string, persist?: boolean) => {
    const storage = persist === false ? sessionStorage : localStorage
    storage.setItem('access_token', token)
    storage.setItem('currentUser', JSON.stringify(newUser))
    setUser(newUser)
    setAccessToken(token)
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('currentUser')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('currentUser')
    setUser(null)
    setAccessToken(null)
  }, [])

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user],
  )

  return (
    <AuthContext
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        setAuth,
        clearAuth,
        hasRole,
      }}
    >
      {children}
    </AuthContext>
  )
}
