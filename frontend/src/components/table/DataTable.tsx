import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/common/Pagination'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  loading?: boolean
  pageSize?: number
}

export function DataTable<TData>({ columns, data, loading, pageSize: propPageSize }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [page, setPage] = useState(1)
  const pageSize = propPageSize ?? 20

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  const paginatedData = useMemo(() => {
    if (!propPageSize) return data
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize, propPageSize])

  const tableData = propPageSize ? paginatedData : data

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPage(1)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      <div className="scroll-area min-h-0 overflow-auto">
        <div className="inline-block min-w-full overflow-hidden rounded-fluid border border-border bg-surface">
          <table className="min-w-[680px] text-fluid-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-neutral-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-fluid-sm py-fluid-sm text-left text-fluid-xs font-semibold uppercase tracking-wider text-text-secondary"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'flex items-center gap-1 transition-colors',
                            header.column.getCanSort() ? 'cursor-pointer hover:text-text-primary' : '',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp style={{ width: 'var(--icon)', height: 'var(--icon)' }} />,
                            desc: <ChevronDown style={{ width: 'var(--icon)', height: 'var(--icon)' }} />,
                          }[header.column.getIsSorted() as string] ??
                            (header.column.getCanSort() ? (
                              <ChevronsUpDown className="text-text-secondary/40" style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
                            ) : null)}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-fluid-sm py-fluid-lg text-center text-text-secondary">
                    Chargement...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-fluid-sm py-fluid-lg text-center text-text-secondary">
                    Aucune donnée
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-neutral-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-fluid-sm py-fluid-sm text-text-primary">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {propPageSize && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  )
}
