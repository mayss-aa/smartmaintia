import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useTickets, useTicket, useCreateTicket, useUpdateTicket, useDeleteTicket } from '@/features/tickets/hooks/useTickets'
import { ticketsService } from '@/features/tickets/services/tickets.service'
import { mockTickets, mockCreateTicketPayload, mockUpdateTicketPayload } from '../../mocks/data'

vi.mock('@/features/tickets/services/tickets.service')

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useTickets', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('fetches tickets', async () => {
    vi.mocked(ticketsService.getAll).mockResolvedValue(mockTickets)
    const { result } = renderHook(() => useTickets(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(3)
  })

  it('fetches single ticket via useTicket', async () => {
    vi.mocked(ticketsService.getById).mockResolvedValue(mockTickets[0])
    const { result } = renderHook(() => useTicket(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id_ticket).toBe(1)
  })

  it('creates ticket via useCreateTicket', async () => {
    vi.mocked(ticketsService.create).mockResolvedValue(mockTickets[0])
    const { result } = renderHook(() => useCreateTicket(), { wrapper: createWrapper() })
    result.current.mutate(mockCreateTicketPayload)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('updates ticket via useUpdateTicket', async () => {
    vi.mocked(ticketsService.update).mockResolvedValue(mockTickets[0])
    const { result } = renderHook(() => useUpdateTicket(), { wrapper: createWrapper() })
    result.current.mutate({ id: 1, payload: mockUpdateTicketPayload })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('deletes ticket via useDeleteTicket', async () => {
    vi.mocked(ticketsService.delete).mockResolvedValue()
    const { result } = renderHook(() => useDeleteTicket(), { wrapper: createWrapper() })
    result.current.mutate(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
