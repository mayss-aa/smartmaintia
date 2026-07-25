import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { AuthContext, type AuthContextValue } from '@/store/auth/AuthContext'
import { mockAdminUser } from '../../mocks/data'

const mockClearAuth = vi.fn()

const authValue: AuthContextValue = {
  user: mockAdminUser,
  accessToken: 'token',
  isAuthenticated: true,
  isLoading: false,
  setAuth: vi.fn(),
  clearAuth: mockClearAuth,
  hasRole: vi.fn(),
}

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <AuthContext.Provider value={authValue}>
          <MemoryRouter>{children}</MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    )
  }
}

describe('useLogout', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns a logout function', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
    expect(typeof result.current).toBe('function')
  })

  it('calls clearAuth when invoked', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
    result.current()
    expect(mockClearAuth).toHaveBeenCalledOnce()
  })
})
