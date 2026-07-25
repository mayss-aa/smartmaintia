import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import Tickets from '@/pages/Tickets'
import { ticketsService } from '@/features/tickets/services/tickets.service'
import { testBenchesService } from '@/features/test-benches/services/test-benches.service'
import { mockTickets } from '../../mocks/data'
import { mockManagerUser, mockTestBenches } from '../../mocks/data'

vi.mock('@/features/tickets/services/tickets.service')
vi.mock('@/features/test-benches/services/test-benches.service')

describe('Tickets page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(ticketsService.getAll).mockResolvedValue(mockTickets)
    vi.mocked(testBenchesService.getAll).mockResolvedValue(mockTestBenches)
  })

  it('renders page header', async () => {
    render(<Tickets />)
    await waitFor(() => {
      expect(screen.getByText('Tickets')).toBeInTheDocument()
    })
  })

  it('renders ticket list after loading', async () => {
    render(<Tickets />)
    await waitFor(() => {
      expect(screen.getByText('Bruit anormal')).toBeInTheDocument()
    })
  })

  it('shows empty state when no tickets', async () => {
    vi.mocked(ticketsService.getAll).mockResolvedValue([])
    render(<Tickets />)
    await waitFor(() => {
      expect(screen.getByText('Aucun ticket')).toBeInTheDocument()
    })
  })

  it('shows create button for manager', async () => {
    render(<Tickets />, { authValue: { user: mockManagerUser } })
    await waitFor(() => {
      expect(screen.getByText('Nouveau ticket')).toBeInTheDocument()
    })
  })
})
