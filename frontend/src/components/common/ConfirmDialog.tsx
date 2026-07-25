import { Modal } from './Modal'
import { Loader } from '@/components/feedback/Loader'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isLoading?: boolean
  variant?: 'danger' | 'primary'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  isLoading,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="mb-6 text-sm text-text-secondary">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-neutral-50"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`btn-hover flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ${
            variant === 'danger'
              ? 'bg-error hover:bg-error/90'
              : 'bg-primary-600 hover:bg-primary-700'
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isLoading && <Loader className="h-4 w-4 border-white" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
