import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'

export const rolesService = {
  async getAll(): Promise<string[]> {
    const response = await api.get<string[]>(API_ENDPOINTS.ROLES)
    return response.data
  },
}
