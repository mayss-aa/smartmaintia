import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <p className="text-sm text-text-secondary">
        Page {page} sur {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-xl border border-border p-2 text-text-secondary transition-all duration-200 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => (
            <span key={p} className="flex items-center gap-1">
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="px-1 text-text-secondary">...</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  p === page
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-text-secondary hover:bg-neutral-100'
                }`}
              >
                {p}
              </button>
            </span>
          ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-xl border border-border p-2 text-text-secondary transition-all duration-200 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
