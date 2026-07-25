import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Users } from 'lucide-react'

describe('MetricCard', () => {
  it('renders value and title', () => {
    render(<MetricCard icon={Users} value={42} title="Utilisateurs" color="primary" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
  })

  it('renders icon', () => {
    const { container } = render(<MetricCard icon={Users} value={10} title="Test" color="primary" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('displays zero value', () => {
    render(<MetricCard icon={Users} value={0} title="Zéro" color="primary" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
