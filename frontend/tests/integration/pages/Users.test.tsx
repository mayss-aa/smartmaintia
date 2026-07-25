import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import Users from '@/pages/Users'
import { usersService } from '@/features/users/services/users.service'
import type { User } from '@/types/user'

vi.mock('@/features/users/services/users.service')

const mockUsers: User[] = [
  { id_user: 1, nom: 'Admin', prenom: 'System', email: 'admin@test.com', role: 'ADMINISTRATEUR' },
  { id_user: 2, nom: 'Manager', prenom: 'Test', email: 'manager@test.com', role: 'MANAGER_MAINTENANCE' },
  { id_user: 3, nom: 'Tech', prenom: 'Jean', email: 'tech@test.com', role: 'TECHNICIEN' },
]

describe('Users page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usersService.getAll).mockResolvedValue(mockUsers)
  })

  it('renders page header', async () => {
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
    })
  })

  it('renders user list after loading', async () => {
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('manager@test.com')).toBeInTheDocument()
  })

  it('filters users by search', async () => {
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
    const searchInput = screen.getByPlaceholderText(/rechercher un utilisateur/i)
    fireEvent.change(searchInput, { target: { value: 'tech' } })
    await waitFor(() => {
      expect(screen.queryByText('Admin')).not.toBeInTheDocument()
    })
    expect(screen.getByText('tech@test.com')).toBeInTheDocument()
  })

  it('shows empty state when no users', async () => {
    vi.mocked(usersService.getAll).mockResolvedValue([])
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('Aucun utilisateur')).toBeInTheDocument()
    })
  })
})
