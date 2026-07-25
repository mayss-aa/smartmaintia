import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirmer',
    message: 'Êtes-vous sûr ?',
    confirmLabel: 'Supprimer',
  }

  it('renders title and message', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Confirmer')).toBeInTheDocument()
    expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Supprimer'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn()
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByText('Annuler'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
