import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import Planning from '@/pages/Planning'
import { planningService } from '@/features/planning/services/planning.service'
import { mockPlanningEntries, mockManagerUser, mockTechnicianUser } from '../../mocks/data'

vi.mock('@/features/planning/services/planning.service')

describe('Planning page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(planningService.getAll).mockResolvedValue(mockPlanningEntries)
  })

  it('renders page header', async () => {
    render(<Planning />, { authValue: { user: mockManagerUser } })
    await waitFor(() => {
      expect(screen.getByText('Planning')).toBeInTheDocument()
    })
  })

  it('displays planning entries after loading', async () => {
    render(<Planning />, { authValue: { user: mockManagerUser } })
    await waitFor(() => {
      expect(screen.getByText('BANC-001')).toBeInTheDocument()
    })
  })

  it('shows empty state when no entries', async () => {
    vi.mocked(planningService.getAll).mockResolvedValue([])
    render(<Planning />, { authValue: { user: mockTechnicianUser } })
    await waitFor(() => {
      expect(screen.getByText('Aucune planification')).toBeInTheDocument()
    })
  })

  it('shows delete button for manager', async () => {
    render(<Planning />, { authValue: { user: mockManagerUser } })
    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Supprimer')
      expect(deleteButtons.length).toBeGreaterThan(0)
    })
  })
})
