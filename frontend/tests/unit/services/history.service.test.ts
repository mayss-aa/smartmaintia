import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { historyService } from '@/features/history/services/history.service'
import { mockHistoryEntries } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn() },
}))

describe('historyService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns history entries', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockHistoryEntries })
    const result = await historyService.getAll()
    expect(api.get).toHaveBeenCalledWith('/historiques')
    expect(result).toHaveLength(2)
  })

  it('getById returns entry', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockHistoryEntries[0] })
    const result = await historyService.getById(1)
    expect(api.get).toHaveBeenCalledWith('/historiques/1')
    expect(result.id_historique).toBe(1)
  })

  it('getAll handles error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Not Found'))
    await expect(historyService.getAll()).rejects.toThrow('Not Found')
  })
})
