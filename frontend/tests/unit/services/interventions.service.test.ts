import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { interventionsService } from '@/features/interventions/services/interventions.service'
import { mockInterventions, mockCreateInterventionPayload, mockUpdateInterventionPayload } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('interventionsService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns interventions', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockInterventions })
    const result = await interventionsService.getAll()
    expect(api.get).toHaveBeenCalledWith('/interventions')
    expect(result).toHaveLength(3)
  })

  it('getById returns intervention', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockInterventions[0] })
    const result = await interventionsService.getById(1)
    expect(api.get).toHaveBeenCalledWith('/interventions/1')
    expect(result.id_intervention).toBe(1)
  })

  it('create sends payload', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id_intervention: 4, ...mockCreateInterventionPayload } })
    const result = await interventionsService.create(mockCreateInterventionPayload)
    expect(api.post).toHaveBeenCalledWith('/interventions', mockCreateInterventionPayload)
    expect(result.id_intervention).toBe(4)
  })

  it('update sends payload', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockInterventions[0], ...mockUpdateInterventionPayload } })
    const result = await interventionsService.update(1, mockUpdateInterventionPayload)
    expect(api.put).toHaveBeenCalledWith('/interventions/1', mockUpdateInterventionPayload)
    expect(result.statut_intervention).toBe('en_cours')
  })

  it('delete calls endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})
    await interventionsService.delete(1)
    expect(api.delete).toHaveBeenCalledWith('/interventions/1')
  })
})
