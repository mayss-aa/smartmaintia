import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { Ticket, CreateTicketPayload, UpdateTicketPayload } from '@/types/ticket'

export const ticketsService = {
  async getAll(): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(API_ENDPOINTS.TICKETS)
    return response.data
  },
  async getById(id: number): Promise<Ticket> {
    const response = await api.get<Ticket>(`${API_ENDPOINTS.TICKETS}${id}`)
    return response.data
  },
  async create(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await api.post<Ticket>(API_ENDPOINTS.TICKETS, payload)
    return response.data
  },
  async update(id: number, payload: UpdateTicketPayload): Promise<Ticket> {
    const response = await api.put<Ticket>(`${API_ENDPOINTS.TICKETS}${id}`, payload)
    return response.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.TICKETS}${id}`)
  },
}
