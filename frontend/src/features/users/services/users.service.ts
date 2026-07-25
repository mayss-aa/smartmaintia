import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>(API_ENDPOINTS.USERS)
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`${API_ENDPOINTS.USERS}${id}`)
    return response.data
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<User>(API_ENDPOINTS.USERS, payload)
    return response.data
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    const response = await api.put<User>(`${API_ENDPOINTS.USERS}${id}`, payload)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.USERS}${id}`)
  },

  async getTechnicians(): Promise<User[]> {
    const response = await api.get<User[]>(API_ENDPOINTS.TECHNICIANS)
    return response.data
  },
}
