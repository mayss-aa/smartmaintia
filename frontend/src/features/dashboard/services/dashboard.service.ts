import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { DashboardData } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>(API_ENDPOINTS.DASHBOARD)
    return response.data
  },
}
