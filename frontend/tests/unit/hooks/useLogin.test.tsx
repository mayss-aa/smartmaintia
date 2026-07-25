import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/store/auth/AuthContext'
import { MemoryRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { authService } from '@/features/auth/services/auth.service'
import { mockLoginResponse, mockAdminUser } from '../../mocks/data'

vi.mock('@/features/auth/services/auth.service')

const mockSetAuth = vi.fn()

const authValue: AuthContextValue = {
  user: mockAdminUser,
  accessToken: 'token',
  isAuthenticated: true,
  isLoading: false,
  setAuth: mockSetAuth,
  clearAuth: vi.fn(),
  hasRole: vi.fn(),
}

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={qc}>
          <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    )
  }
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authService.login).mockResolvedValue(mockLoginResponse)
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockAdminUser)
  })

  it('calls login and returns token', async () => {
    const { result } = renderHook(() => useLogin(mockSetAuth), { wrapper: createWrapper() })
    result.current.mutate({ email: 'admin@test.com', password: 'pass' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(authService.login).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'pass' })
  })

  it('calls setAuth on success', async () => {
    const { result } = renderHook(() => useLogin(mockSetAuth), { wrapper: createWrapper() })
    result.current.mutate({ email: 'admin@test.com', password: 'pass' })
    await waitFor(() => expect(mockSetAuth).toHaveBeenCalled())
    expect(mockSetAuth).toHaveBeenCalledWith(mockAdminUser, mockLoginResponse.access_token)
  })

  it('handles login failure', async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(new Error('Invalid credentials'))
    const { result } = renderHook(() => useLogin(mockSetAuth), { wrapper: createWrapper() })
    result.current.mutate({ email: 'wrong@test.com', password: 'wrong' })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(mockSetAuth).not.toHaveBeenCalled()
  })
})
