import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { PlanningItem, UpdatePlanningPayload } from '@/types/planning'

export const planningService = {
  async getAll(): Promise<PlanningItem[]> {
    const response = await api.get<PlanningItem[]>(API_ENDPOINTS.PLANNING)
    return response.data
  },
  async update(id: number, payload: UpdatePlanningPayload): Promise<PlanningItem> {
    const response = await api.put<PlanningItem>(`${API_ENDPOINTS.PLANNING}${id}`, payload)
    return response.data
  },
}
