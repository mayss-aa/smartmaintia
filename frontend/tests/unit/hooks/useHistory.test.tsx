import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useHistory, useHistoryEntry } from '@/features/history/hooks/useHistory'
import { historyService } from '@/features/history/services/history.service'
import { mockHistoryEntries } from '../../mocks/data'

vi.mock('@/features/history/services/history.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useHistory', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches history entries', async () => {
    vi.mocked(historyService.getAll).mockResolvedValue(mockHistoryEntries)
    const { result } = renderHook(() => useHistory(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('fetches single entry', async () => {
    vi.mocked(historyService.getById).mockResolvedValue(mockHistoryEntries[0])
    const { result } = renderHook(() => useHistoryEntry(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id_historique).toBe(1)
  })
})
