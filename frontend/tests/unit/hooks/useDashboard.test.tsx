import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'
import { mockDashboardData } from '../../mocks/data'

vi.mock('@/features/dashboard/services/dashboard.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useDashboard', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches dashboard data', async () => {
    vi.mocked(dashboardService.getDashboard).mockResolvedValue(mockDashboardData)
    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.total_utilisateurs).toBe(10)
    expect(result.current.data?.total_tickets).toBe(20)
  })
})
