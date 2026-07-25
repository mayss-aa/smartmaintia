import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import Incident from '@/pages/Incident'
import { ticketsService } from '@/features/tickets/services/tickets.service'
import { mockTickets, mockOperatorUser } from '../../mocks/data'

vi.mock('@/features/tickets/services/tickets.service')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Incident page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(ticketsService.create).mockResolvedValue(mockTickets[0])
  })

  it('renders the incident form', () => {
    render(<Incident />, { authValue: { user: mockOperatorUser } })
    expect(screen.getByText("Déclaration d'incident")).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: BANC-001')).toBeInTheDocument()
    expect(screen.getByText('Déclarer l\'incident')).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<Incident />, { authValue: { user: mockOperatorUser } })
    fireEvent.click(screen.getByText('Déclarer l\'incident'))
    await waitFor(() => {
      expect(screen.getByText('Le banc est obligatoire')).toBeInTheDocument()
    })
  })
})
