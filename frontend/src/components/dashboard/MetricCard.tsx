import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  value: string | number
  title: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  onClick?: () => void
  trend?: { value: number; direction: 'up' | 'down' }
}

const colorMap = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
}

export function MetricCard({ icon: Icon, value, title, color = 'primary', onClick, trend }: MetricCardProps) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-fluid border border-border bg-white',
        onClick ? 'cursor-pointer' : '',
      )}
      style={{ padding: 'clamp(8px, 1.1vh, 14px) clamp(10px, 1.2vw, 18px)' }}
    >
      <div className="flex items-center justify-between gap-fluid-sm">
        <div className="min-w-0">
          <p className="text-fluid-2xl font-bold leading-none text-text-primary">{value}</p>
          <p className="mt-1 truncate text-fluid-sm text-text-secondary">{title}</p>
          {trend && (
            <p className={cn(
              'mt-1 flex items-center gap-0.5 text-fluid-xs',
              trend.direction === 'up' ? 'text-success' : 'text-error',
            )}>
              {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </p>
          )}
        </div>
        <div
          className={cn('flex h-tile w-tile shrink-0 items-center justify-center rounded-lg', colorMap[color])}
        >
          <Icon style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
        </div>
      </div>
    </Component>
  )
}
