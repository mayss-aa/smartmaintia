import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import { Modal } from '@/components/common/Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Test Modal"><p>Content</p></Modal>)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(<Modal open={false} onClose={vi.fn()} title="Hidden"><p>Content</p></Modal>)
    expect(container.textContent).not.toContain('Hidden')
  })

  it('renders description when provided', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Test" description="Description text"><p>Content</p></Modal>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })
})
