import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { usePlanning, useCreatePlanning, useUpdatePlanning } from '@/features/planning/hooks/usePlanning'
import { planningService } from '@/features/planning/services/planning.service'
import { mockPlanningEntries, mockCreatePlanningPayload, mockUpdatePlanningPayload } from '../../mocks/data'

vi.mock('@/features/planning/services/planning.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('usePlanning', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches planning entries', async () => {
    vi.mocked(planningService.getAll).mockResolvedValue(mockPlanningEntries)
    const { result } = renderHook(() => usePlanning(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('creates planning entry', async () => {
    vi.mocked(planningService.create).mockResolvedValue(mockPlanningEntries[0])
    const { result } = renderHook(() => useCreatePlanning(), { wrapper: createWrapper() })
    result.current.mutate(mockCreatePlanningPayload)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('updates planning entry', async () => {
    vi.mocked(planningService.update).mockResolvedValue(mockPlanningEntries[0])
    const { result } = renderHook(() => useUpdatePlanning(), { wrapper: createWrapper() })
    result.current.mutate({ id: 1, payload: mockUpdatePlanningPayload })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
