import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import Profile from '@/pages/Profile'
import { mockAdminUser, mockTechnicianUser } from '../../mocks/data'

describe('Profile page', () => {
  it('renders admin user info', () => {
    render(<Profile />, { authValue: { user: mockAdminUser } })
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('System Admin')).toBeInTheDocument()
    expect(screen.getByText('admin@smartmaint.com')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('renders technician user info', () => {
    render(<Profile />, { authValue: { user: mockTechnicianUser } })
    expect(screen.getByText('Jean Technicien')).toBeInTheDocument()
    expect(screen.getByText('technicien@smartmaint.com')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('renders role label', () => {
    render(<Profile />, { authValue: { user: mockAdminUser } })
    expect(screen.getAllByText('Administrateur').length).toBeGreaterThanOrEqual(1)
  })
})
