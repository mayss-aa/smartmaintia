import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="flex-1">
        <h1 className="text-fluid-2xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="mt-1 text-fluid-sm text-text-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}
