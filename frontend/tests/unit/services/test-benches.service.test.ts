import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { testBenchesService, type CreateTestBenchPayload } from '@/features/test-benches/services/test-benches.service'
import { mockTestBenches } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('testBenchesService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns benches', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTestBenches })
    const result = await testBenchesService.getAll()
    expect(api.get).toHaveBeenCalledWith('/bancs')
    expect(result).toHaveLength(3)
  })

  it('getByCode returns bench', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTestBenches[0] })
    const result = await testBenchesService.getByCode('BANC-001')
    expect(api.get).toHaveBeenCalledWith('/bancs/BANC-001')
    expect(result.code_banc).toBe('BANC-001')
  })

  it('create sends payload', async () => {
    const payload: CreateTestBenchPayload = { code_banc: 'BANC-004', nom: 'Nouveau', emplacement: 'Zone C', statut: 'OPERATIONNEL' }
    vi.mocked(api.post).mockResolvedValueOnce({ data: payload })
    const result = await testBenchesService.create(payload)
    expect(api.post).toHaveBeenCalledWith('/bancs', payload)
    expect(result.code_banc).toBe('BANC-004')
  })

  it('update sends payload', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockTestBenches[0], nom: 'Updated' } })
    const result = await testBenchesService.update('BANC-001', { nom: 'Updated' })
    expect(api.put).toHaveBeenCalledWith('/bancs/BANC-001', { nom: 'Updated' })
    expect(result.nom).toBe('Updated')
  })

  it('delete calls endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})
    await testBenchesService.delete('BANC-001')
    expect(api.delete).toHaveBeenCalledWith('/bancs/BANC-001')
  })
})
