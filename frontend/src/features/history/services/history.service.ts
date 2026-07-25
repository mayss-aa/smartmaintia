import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { HistoryEntry } from '@/types/history'

export const historyService = {
  async getAll(): Promise<HistoryEntry[]> {
    const response = await api.get<HistoryEntry[]>(API_ENDPOINTS.HISTORIQUES)
    return response.data
  },
  async getById(id: number): Promise<HistoryEntry> {
    const response = await api.get<HistoryEntry>(`${API_ENDPOINTS.HISTORIQUES}${id}`)
    return response.data
  },
}
