import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'
import { mockDashboardData } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn() },
}))

describe('dashboardService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getDashboard returns dashboard data', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDashboardData })
    const result = await dashboardService.getDashboard()
    expect(api.get).toHaveBeenCalledWith('/dashboard')
    expect(result.total_utilisateurs).toBe(10)
    expect(result.total_tickets).toBe(20)
  })
})
