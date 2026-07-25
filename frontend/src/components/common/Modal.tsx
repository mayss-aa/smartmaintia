import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative mx-3 w-full rounded-fluid bg-surface shadow-dialog',
          footer
            ? 'max-h-[90vh] flex flex-col'
            : 'max-h-[85dvh] p-fluid-sm',
          sizeClasses[size],
        )}
      >
        <div className={cn('flex items-start justify-between', footer ? 'shrink-0 border-b border-border p-fluid-sm' : 'mb-fluid-sm')}>
          <div className="min-w-0">
            <h2 className="text-fluid-lg font-semibold text-text-primary">{title}</h2>
            {description && <p className="mt-0.5 text-fluid-sm text-text-secondary">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-text-secondary hover:bg-neutral-100 hover:text-text-primary"
            aria-label="Fermer"
          >
            <X style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
          </button>
        </div>
        <div className={cn(footer ? 'flex-1 min-h-0 overflow-y-auto p-fluid-sm' : 'scroll-area min-h-0 overflow-y-auto')}>
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-border p-fluid-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
