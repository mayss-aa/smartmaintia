import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { Loader } from '@/components/feedback/Loader'

describe('Loader', () => {
  it('renders with default size', () => {
    render(<Loader />)
    const loader = screen.getByRole('status')
    expect(loader).toBeInTheDocument()
  })

  it('renders with lg size', () => {
    render(<Loader size="lg" />)
    const loader = screen.getByRole('status')
    expect(loader).toBeInTheDocument()
  })

  it('has accessible role', () => {
    render(<Loader />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
