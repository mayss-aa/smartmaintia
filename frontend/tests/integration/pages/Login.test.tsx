import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import Login from '@/pages/Login'
import { authService } from '@/features/auth/services/auth.service'
import { mockLoginResponse, mockAdminUser } from '../../mocks/data'

vi.mock('@/features/auth/services/auth.service')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authService.login).mockResolvedValue(mockLoginResponse)
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockAdminUser)
  })

  it('renders login form', () => {
    render(<Login />, { authValue: { isAuthenticated: false, user: null, accessToken: null } })
    expect(screen.getByText('SmartMaint IA')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('calls login on form submission', async () => {
    render(<Login />, { authValue: { isAuthenticated: false, user: null, accessToken: null } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled()
    })
  })
})
