import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useAlerts, useAlert } from '@/features/alerts/hooks/useAlerts'
import { alertsService } from '@/features/alerts/services/alerts.service'
import { mockAlerts } from '../../mocks/data'

vi.mock('@/features/alerts/services/alerts.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useAlerts', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches alerts', async () => {
    vi.mocked(alertsService.getAll).mockResolvedValue(mockAlerts)
    const { result } = renderHook(() => useAlerts(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('fetches single alert', async () => {
    vi.mocked(alertsService.getById).mockResolvedValue(mockAlerts[0])
    const { result } = renderHook(() => useAlert(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id_alerte).toBe(1)
  })
})
