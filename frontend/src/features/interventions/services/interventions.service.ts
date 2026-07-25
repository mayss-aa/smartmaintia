import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { Intervention, CreateInterventionPayload, UpdateInterventionPayload, CompleteInterventionPayload } from '@/types/intervention'

export const interventionsService = {
  async getAll(): Promise<Intervention[]> {
    const response = await api.get<Intervention[]>(API_ENDPOINTS.INTERVENTIONS)
    return response.data
  },
  async getMine(): Promise<Intervention[]> {
    const response = await api.get<Intervention[]>(`${API_ENDPOINTS.INTERVENTIONS}technicien/mes-interventions`)
    return response.data
  },
  async getById(id: number): Promise<Intervention> {
    const response = await api.get<Intervention>(`${API_ENDPOINTS.INTERVENTIONS}${id}`)
    return response.data
  },
  async create(payload: CreateInterventionPayload): Promise<Intervention> {
    const response = await api.post<Intervention>(API_ENDPOINTS.INTERVENTIONS, payload)
    return response.data
  },
  async update(id: number, payload: UpdateInterventionPayload): Promise<Intervention> {
    const response = await api.put<Intervention>(`${API_ENDPOINTS.INTERVENTIONS}${id}`, payload)
    return response.data
  },
  async start(id: number): Promise<Intervention> {
    const response = await api.put<Intervention>(`${API_ENDPOINTS.INTERVENTIONS}${id}/start`)
    return response.data
  },
  async complete(id: number, payload: CompleteInterventionPayload): Promise<Intervention> {
    const response = await api.put<Intervention>(`${API_ENDPOINTS.INTERVENTIONS}${id}/complete`, payload)
    return response.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.INTERVENTIONS}${id}`)
  },
}
