import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { planningService } from '@/features/planning/services/planning.service'
import { mockPlanningEntries, mockCreatePlanningPayload, mockUpdatePlanningPayload } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

describe('planningService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns planning entries', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPlanningEntries })
    const result = await planningService.getAll()
    expect(api.get).toHaveBeenCalledWith('/planning')
    expect(result).toHaveLength(2)
  })

  it('create sends payload', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id_intervention: 3, ...mockCreatePlanningPayload } })
    const result = await planningService.create(mockCreatePlanningPayload)
    expect(api.post).toHaveBeenCalledWith('/planning', mockCreatePlanningPayload)
    expect(result.id_intervention).toBe(3)
  })

  it('update sends payload', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockPlanningEntries[0], ...mockUpdatePlanningPayload } })
    const result = await planningService.update(1, mockUpdatePlanningPayload)
    expect(api.put).toHaveBeenCalledWith('/planning/1', mockUpdatePlanningPayload)
    expect(result.statut_intervention).toBe('en_cours')
  })
})
