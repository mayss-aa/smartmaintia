import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/features/users/hooks/useUsers'
import { usersService } from '@/features/users/services/users.service'
import { mockAdminUser } from '../../mocks/data'

vi.mock('@/features/users/services/users.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useUsers', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches users list', async () => {
    vi.mocked(usersService.getAll).mockResolvedValue([mockAdminUser])
    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockAdminUser])
  })

  it('creates user via useCreateUser', async () => {
    vi.mocked(usersService.create).mockResolvedValue(mockAdminUser)
    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })
    result.current.mutate({ nom: 'Test', prenom: 'User', email: 'test@test.com', password: 'pass', role: 'TECHNICIEN' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('updates user via useUpdateUser', async () => {
    vi.mocked(usersService.update).mockResolvedValue(mockAdminUser)
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })
    result.current.mutate({ id: 1, payload: { nom: 'Updated' } })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('deletes user via useDeleteUser', async () => {
    vi.mocked(usersService.delete).mockResolvedValue()
    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() })
    result.current.mutate(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
