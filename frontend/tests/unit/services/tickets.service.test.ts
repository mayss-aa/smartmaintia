import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { ticketsService } from '@/features/tickets/services/tickets.service'
import { mockTickets, mockCreateTicketPayload, mockUpdateTicketPayload } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('ticketsService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns tickets', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTickets })
    const result = await ticketsService.getAll()
    expect(api.get).toHaveBeenCalledWith('/tickets')
    expect(result).toHaveLength(3)
  })

  it('getById returns ticket', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTickets[0] })
    const result = await ticketsService.getById(1)
    expect(api.get).toHaveBeenCalledWith('/tickets/1')
    expect(result.id_ticket).toBe(1)
  })

  it('create sends payload', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id_ticket: 4, ...mockCreateTicketPayload, date_creation: new Date().toISOString(), statut: 'OUVERT' } })
    const result = await ticketsService.create(mockCreateTicketPayload)
    expect(api.post).toHaveBeenCalledWith('/tickets', mockCreateTicketPayload)
    expect(result.id_ticket).toBe(4)
  })

  it('update sends payload', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockTickets[0], ...mockUpdateTicketPayload } })
    const result = await ticketsService.update(1, mockUpdateTicketPayload)
    expect(api.put).toHaveBeenCalledWith('/tickets/1', mockUpdateTicketPayload)
    expect(result.statut).toBe('EN_COURS')
  })

  it('delete calls endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})
    await ticketsService.delete(1)
    expect(api.delete).toHaveBeenCalledWith('/tickets/1')
  })
})
