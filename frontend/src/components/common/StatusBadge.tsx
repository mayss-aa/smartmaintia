import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusColors: Record<string, string> = {
  OUVERT: 'bg-warning/10 text-warning border-warning/20',
  EN_COURS: 'bg-info/10 text-info border-info/20',
  CLOTURE: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  RESOLU: 'bg-success/10 text-success border-success/20',
  FERME: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  TERMINE: 'bg-success/10 text-success border-success/20',
  TERMINEE: 'bg-success/10 text-success border-success/20',
  PLANIFIEE: 'bg-primary-50 text-primary-600 border-primary-200',
  planifié: 'bg-primary-50 text-primary-600 border-primary-200',
  en_cours: 'bg-info/10 text-info border-info/20',
  terminé: 'bg-success/10 text-success border-success/20',
  annulé: 'bg-error/10 text-error border-error/20',
  ANNULEE: 'bg-error/10 text-error border-error/20',
  OPERATIONNEL: 'bg-success/10 text-success border-success/20',
  EN_PANNE: 'bg-error/10 text-error border-error/20',
  EN_MAINTENANCE: 'bg-warning/10 text-warning border-warning/20',
  Nouvelle: 'bg-warning/10 text-warning border-warning/20',
  Validée: 'bg-success/10 text-success border-success/20',
  Archivée: 'bg-neutral-100 text-neutral-600 border-neutral-200',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: 'currentColor', opacity: 0.6 }} />
      {status}
    </span>
  )
}
