import api from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'

export interface TestBench {
  code_banc: string
  nom: string
  statut: string
  emplacement: string
}

export interface CreateTestBenchPayload {
  code_banc: string
  nom: string
  emplacement: string
  statut: string
}

export const testBenchesService = {
  async getAll(): Promise<TestBench[]> {
    const response = await api.get<TestBench[]>(API_ENDPOINTS.BANCS)
    return response.data
  },
  async getByCode(code: string): Promise<TestBench> {
    const response = await api.get<TestBench>(`${API_ENDPOINTS.BANCS}${code}`)
    return response.data
  },
  async create(payload: CreateTestBenchPayload): Promise<TestBench> {
    const response = await api.post<TestBench>(API_ENDPOINTS.BANCS, payload)
    return response.data
  },
  async update(code: string, payload: Partial<CreateTestBenchPayload>): Promise<TestBench> {
    const response = await api.put<TestBench>(`${API_ENDPOINTS.BANCS}${code}`, payload)
    return response.data
  },
  async delete(code: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.BANCS}${code}`)
  },
}
