import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="card-hover rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-4 text-fluid-base font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  )
}
