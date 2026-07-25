import { createContext } from 'react'
import type { User } from '@/types/auth'

export interface AuthContextValue {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string, persist?: boolean) => void
  clearAuth: () => void
  hasRole: (roles: string[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
