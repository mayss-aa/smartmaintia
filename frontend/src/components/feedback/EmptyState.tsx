import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-fluid border border-dashed border-border bg-surface px-4 py-16">
      <div className="mb-fluid-sm flex items-center justify-center rounded-full bg-neutral-100" style={{ width: 'var(--tile)', height: 'var(--tile)' }}>
        <Icon style={{ width: 'var(--icon)', height: 'var(--icon)' }} className="text-text-secondary/40" />
      </div>
      <h3 className="text-fluid-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-center text-fluid-sm text-text-secondary">{description}</p>
      )}
    </div>
  )
}
