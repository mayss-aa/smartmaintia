import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { StatusBadge } from '@/components/common/StatusBadge'

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="OUVERT" />)
    expect(screen.getByText('OUVERT')).toBeInTheDocument()
  })

  it('renders with success color for OPERATIONNEL', () => {
    const { container } = render(<StatusBadge status="OPERATIONNEL" />)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('success')
  })

  it('renders with error color for EN_PANNE', () => {
    const { container } = render(<StatusBadge status="EN_PANNE" />)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('error')
  })

  it('renders with warning color for OUVERT', () => {
    const { container } = render(<StatusBadge status="OUVERT" />)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('warning')
  })

  it('handles lowercase status values', () => {
    render(<StatusBadge status="planifié" />)
    expect(screen.getByText('planifié')).toBeInTheDocument()
  })

  it('handles unknown status with fallback', () => {
    render(<StatusBadge status="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })
})
