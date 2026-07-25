import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { authService } from '@/features/auth/services/auth.service'
import { mockLoginResponse, mockAdminUser } from '../../mocks/data'

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login sends credentials and returns token', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockLoginResponse })

    const result = await authService.login({ email: 'admin@test.com', password: 'password' })

    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'admin@test.com', password: 'password' })
    expect(result).toEqual(mockLoginResponse)
  })

  it('login handles error response', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Invalid credentials'))

    await expect(authService.login({ email: 'wrong@test.com', password: 'wrong' })).rejects.toThrow('Invalid credentials')
  })

  it('getCurrentUser returns user profile', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockAdminUser })

    const result = await authService.getCurrentUser()

    expect(api.get).toHaveBeenCalledWith('/auth/me')
    expect(result).toEqual(mockAdminUser)
  })

  it('getCurrentUser handles 401 error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized')
  })
})
