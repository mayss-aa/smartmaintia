import { describe, it, expect, vi, type ReactNode } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/store/auth/AuthContext'
import { useAuth } from '@/store/auth/useAuth'
import { mockAdminUser } from '../../mocks/data'

function createWrapper(authValue: Partial<AuthContextValue> = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const merged: AuthContextValue = {
    user: mockAdminUser,
    accessToken: 'token',
    isAuthenticated: true,
    isLoading: false,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
    hasRole: (r: string[]) => r.includes(mockAdminUser.role),
    ...authValue,
  }
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <AuthContext.Provider value={merged}>{children}</AuthContext.Provider>
      </QueryClientProvider>
    )
  }
}

describe('useAuth', () => {
  it('returns auth context value', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
    expect(result.current.user).toEqual(mockAdminUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('throws error when used outside AuthProvider', () => {
    const qc = new QueryClient()
    expect(() =>
      renderHook(() => useAuth(), { wrapper: ({ children }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider> }),
    ).toThrow('useAuth must be used within an AuthProvider')
  })

  it('hasRole returns true for matching role', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
    expect(result.current.hasRole(['ADMINISTRATEUR'])).toBe(true)
  })

  it('hasRole returns false for non-matching role', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
    expect(result.current.hasRole(['TECHNICIEN'])).toBe(false)
  })
})
