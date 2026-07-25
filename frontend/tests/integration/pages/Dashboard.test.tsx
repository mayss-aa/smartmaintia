import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import Dashboard from '@/pages/Dashboard'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'
import { mockDashboardData } from '../../mocks/data'

vi.mock('@/features/dashboard/services/dashboard.service')

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(dashboardService.getDashboard).mockResolvedValue(mockDashboardData)
  })

  it('renders loading state initially', () => {
    vi.mocked(dashboardService.getDashboard).mockImplementationOnce(() => new Promise(() => {}))
    render(<Dashboard />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders dashboard metrics after loading', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
    expect(screen.getByText('Bancs')).toBeInTheDocument()
    expect(screen.getByText('Tickets')).toBeInTheDocument()
    expect(screen.getByText('Interventions')).toBeInTheDocument()
  })

  it('renders charts with data', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Tickets par statut')).toBeInTheDocument()
    })
    expect(screen.getByText('Bancs par statut')).toBeInTheDocument()
  })

  it('renders user distribution section', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Répartition des utilisateurs')).toBeInTheDocument()
    })
    expect(screen.getByText('1')).toBeInTheDocument() // administrateur count
    expect(screen.getByText('2')).toBeInTheDocument() // manager count
    expect(screen.getByText('4')).toBeInTheDocument() // technicien count
    expect(screen.getByText('3')).toBeInTheDocument() // operateur count
  })
})
