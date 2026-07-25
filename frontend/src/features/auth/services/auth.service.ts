import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { LoginCredentials, LoginResponse, User } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    )
    return response.data
  },

  async getCurrentUser(token?: string): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.AUTH.ME, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return response.data
  },


}
