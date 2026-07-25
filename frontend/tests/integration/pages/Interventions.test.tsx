import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import Interventions from '@/pages/Interventions'
import { interventionsService } from '@/features/interventions/services/interventions.service'
import { mockInterventions } from '../../mocks/data'
import { mockTechnicianUser } from '../../mocks/data'

vi.mock('@/features/interventions/services/interventions.service')

describe('Interventions page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(interventionsService.getAll).mockResolvedValue(mockInterventions)
  })

  it('renders page header', async () => {
    render(<Interventions />)
    await waitFor(() => {
      expect(screen.getByText('Interventions')).toBeInTheDocument()
    })
  })

  it('renders intervention list for technician role', async () => {
    render(<Interventions />, { authValue: { user: mockTechnicianUser } })
    await waitFor(() => {
      expect(screen.getByText('Mes interventions')).toBeInTheDocument()
    })
  })

  it('shows empty state when no interventions', async () => {
    vi.mocked(interventionsService.getAll).mockResolvedValue([])
    render(<Interventions />)
    await waitFor(() => {
      expect(screen.getByText('Aucune intervention')).toBeInTheDocument()
    })
  })
})
