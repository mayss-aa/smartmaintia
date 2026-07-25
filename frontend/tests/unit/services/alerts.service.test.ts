import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { alertsService } from '@/features/alerts/services/alerts.service'
import { mockAlerts } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn() },
}))

describe('alertsService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns alerts', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockAlerts })
    const result = await alertsService.getAll()
    expect(api.get).toHaveBeenCalledWith('/alertes')
    expect(result).toHaveLength(2)
  })

  it('getById returns alert', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockAlerts[0] })
    const result = await alertsService.getById(1)
    expect(api.get).toHaveBeenCalledWith('/alertes/1')
    expect(result.id_alerte).toBe(1)
  })
})
