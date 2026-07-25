import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useInterventions, useIntervention, useCreateIntervention, useUpdateIntervention, useDeleteIntervention } from '@/features/interventions/hooks/useInterventions'
import { interventionsService } from '@/features/interventions/services/interventions.service'
import { mockInterventions, mockCreateInterventionPayload, mockUpdateInterventionPayload } from '../../mocks/data'

vi.mock('@/features/interventions/services/interventions.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useInterventions', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches interventions', async () => {
    vi.mocked(interventionsService.getAll).mockResolvedValue(mockInterventions)
    const { result } = renderHook(() => useInterventions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(3)
  })

  it('fetches single intervention', async () => {
    vi.mocked(interventionsService.getById).mockResolvedValue(mockInterventions[0])
    const { result } = renderHook(() => useIntervention(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id_intervention).toBe(1)
  })

  it('creates intervention', async () => {
    vi.mocked(interventionsService.create).mockResolvedValue(mockInterventions[0])
    const { result } = renderHook(() => useCreateIntervention(), { wrapper: createWrapper() })
    result.current.mutate(mockCreateInterventionPayload)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('updates intervention', async () => {
    vi.mocked(interventionsService.update).mockResolvedValue(mockInterventions[0])
    const { result } = renderHook(() => useUpdateIntervention(), { wrapper: createWrapper() })
    result.current.mutate({ id: 1, payload: mockUpdateInterventionPayload })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('deletes intervention', async () => {
    vi.mocked(interventionsService.delete).mockResolvedValue()
    const { result } = renderHook(() => useDeleteIntervention(), { wrapper: createWrapper() })
    result.current.mutate(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
