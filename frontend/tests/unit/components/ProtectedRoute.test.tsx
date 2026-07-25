import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test-utils'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { ROLES } from '@/constants/roles'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('ProtectedRoute', () => {
  it('renders children when user has required role', () => {
    render(
      <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATEUR]}>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders children when user has one of multiple allowed roles', () => {
    render(
      <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATEUR, ROLES.MANAGER_MAINTENANCE]}>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders Forbidden when user lacks required role', () => {
    render(
      <ProtectedRoute allowedRoles={[ROLES.OPERATEUR_PRODUCTION]}>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
