import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/store/auth/AuthContext'
import { ToastProvider } from '@/components/feedback/Toast'
import { mockAdminUser } from './mocks/data'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: Partial<AuthContextValue>
  initialRoutes?: string[]
  queryClient?: QueryClient
}

const defaultAuthValue: AuthContextValue = {
  user: mockAdminUser,
  accessToken: 'test-token',
  isAuthenticated: true,
  isLoading: false,
  setAuth: vi.fn(),
  clearAuth: vi.fn(),
  hasRole: (roles: string[]) => roles.includes(mockAdminUser.role),
}

function AllTheProviders({
  children,
  authValue = {},
  initialRoutes = ['/'],
  queryClient,
}: {
  children: ReactNode
  authValue?: Partial<AuthContextValue>
  initialRoutes?: string[]
  queryClient?: QueryClient
}) {
  const qc = queryClient ?? createTestQueryClient()
  const mergedAuth = { ...defaultAuthValue, ...authValue }

  return (
    <QueryClientProvider client={qc}>
      <AuthContext.Provider value={mergedAuth}>
        <ToastProvider>
          <MemoryRouter initialEntries={initialRoutes}>
            {children}
          </MemoryRouter>
        </ToastProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions,
) {
  const { authValue, initialRoutes, queryClient, ...renderOptions } = options ?? {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        authValue={authValue}
        initialRoutes={initialRoutes}
        queryClient={queryClient}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }
export { createTestQueryClient }
