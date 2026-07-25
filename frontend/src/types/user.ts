import type { Role } from '@/constants/roles'

export interface User {
  id_user: number
  nom: string
  prenom: string
  email: string
  role: Role
  telephone?: string
  actif?: boolean
}

export interface CreateUserPayload {
  nom: string
  prenom: string
  email: string
  password: string
  role: Role
}

export interface UpdateUserPayload {
  nom?: string
  prenom?: string
  email?: string
  password?: string
  role?: Role
}
