import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { EmptyState } from '@/components/feedback/EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Aucune donnée" />)
    expect(screen.getByText('Aucune donnée')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Vide" description="Aucun élément à afficher." />)
    expect(screen.getByText('Aucun élément à afficher.')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Vide" />)
    const descEls = container.querySelectorAll('p')
    expect(descEls.length).toBe(0)
  })
})
