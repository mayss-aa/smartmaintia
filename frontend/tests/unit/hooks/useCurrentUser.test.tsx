import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { authService } from '@/features/auth/services/auth.service'
import { mockAdminUser } from '../../mocks/data'

vi.mock('@/features/auth/services/auth.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useCurrentUser', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches current user', async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockAdminUser)
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockAdminUser)
  })

  it('returns error on failure', async () => {
    vi.mocked(authService.getCurrentUser).mockRejectedValueOnce(new Error('Unauthorized'))
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
