import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { usersService } from '@/features/users/services/users.service'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockUser: User = { id_user: 1, nom: 'Test', prenom: 'User', email: 'test@test.com', role: 'TECHNICIEN' }

describe('usersService', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAll returns user list', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockUser] })
    const result = await usersService.getAll()
    expect(api.get).toHaveBeenCalledWith('/users')
    expect(result).toEqual([mockUser])
  })

  it('getById returns user by id', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })
    const result = await usersService.getById(1)
    expect(api.get).toHaveBeenCalledWith('/users/1')
    expect(result).toEqual(mockUser)
  })

  it('create sends payload and returns user', async () => {
    const payload: CreateUserPayload = { nom: 'New', prenom: 'User', email: 'new@test.com', password: 'pass', role: 'TECHNICIEN' }
    vi.mocked(api.post).mockResolvedValueOnce({ data: { ...mockUser, ...payload } })
    const result = await usersService.create(payload)
    expect(api.post).toHaveBeenCalledWith('/users', payload)
    expect(result).toMatchObject({ nom: 'New', prenom: 'User' })
  })

  it('update sends payload and returns user', async () => {
    const payload: UpdateUserPayload = { nom: 'Updated' }
    vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockUser, ...payload } })
    const result = await usersService.update(1, payload)
    expect(api.put).toHaveBeenCalledWith('/users/1', payload)
    expect(result.nom).toBe('Updated')
  })

  it('delete calls endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})
    await usersService.delete(1)
    expect(api.delete).toHaveBeenCalledWith('/users/1')
  })

  it('getAll handles network error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network Error'))
    await expect(usersService.getAll()).rejects.toThrow('Network Error')
  })
})
