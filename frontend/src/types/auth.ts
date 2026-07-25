import type { Role } from '@/constants/roles'

export interface User {
  id_user: number
  nom: string
  prenom: string
  email: string
  role: Role
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
