import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { Alert, CreateAlertPayload, UpdateAlertPayload } from '@/types/alert'

export const alertsService = {
  async getAll(): Promise<Alert[]> {
    const response = await api.get<Alert[]>(API_ENDPOINTS.ALERTES)
    return response.data
  },
  async getById(id: number): Promise<Alert> {
    const response = await api.get<Alert>(`${API_ENDPOINTS.ALERTES}${id}`)
    return response.data
  },
  async create(payload: CreateAlertPayload): Promise<Alert> {
    const response = await api.post<Alert>(API_ENDPOINTS.ALERTES, payload)
    return response.data
  },
  async update(id: number, payload: UpdateAlertPayload): Promise<Alert> {
    const response = await api.put<Alert>(`${API_ENDPOINTS.ALERTES}${id}`, payload)
    return response.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.ALERTES}${id}`)
  },
}
