import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import { ToastProvider } from '@/components/feedback/Toast'

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>App Content</div>
      </ToastProvider>,
    )
    expect(screen.getByText('App Content')).toBeInTheDocument()
  })
})
