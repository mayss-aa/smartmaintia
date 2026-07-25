import { useState, useRef, useEffect } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/table/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Modal } from '@/components/common/Modal'
import { useHistory } from '@/features/history/hooks/useHistory'
import type { HistoryEntry } from '@/types/history'

const SECTION_RE = /^(Rapport|Résumé|Diagnostic|Actions réalisées|Recommandation IA|Recommandation|Commentaire):\s*(.*)/i

const SECTION_LABELS: Record<string, string> = {
  rapport: 'Résumé',
  résumé: 'Résumé',
  diagnostic: 'Diagnostic',
  'actions réalisées': 'Actions réalisées',
  'recommandation ia': 'Recommandation IA',
  recommandation: 'Recommandation IA',
  commentaire: 'Commentaire',
}

function parseReport(text: string) {
  const lines = text.split('\n')
  const sections: { heading: string; content: string }[] = []
  let currentHeading = ''
  let currentContent: string[] = []
  const preamble: string[] = []
  let found = false

  for (const line of lines) {
    const m = line.match(SECTION_RE)
    if (m) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() })
      }
      currentHeading = SECTION_LABELS[m[1].toLowerCase()] ?? m[1]
      currentContent = m[2] ? [m[2]] : []
      found = true
    } else if (currentHeading) {
      currentContent.push(line)
    } else {
      preamble.push(line)
    }
  }

  if (currentHeading) {
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() })
  }

  return { sections, preamble: preamble.join('\n').trim(), isStructured: found }
}

function ReportContent({ text }: { text: string }) {
  const { sections, preamble, isStructured } = parseReport(text)

  if (!isStructured) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
        {text}
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {preamble && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
          {preamble}
        </p>
      )}
      {sections.map((s, i) => (
        <div key={i}>
          <h3 className="mb-1 text-sm font-semibold text-text-primary">{s.heading}</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
            {s.content || '-'}
          </p>
        </div>
      ))}
    </div>
  )
}

function RapportCell({ value }: { value: string | undefined }) {
  const [open, setOpen] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setOverflows(el.scrollHeight > el.clientHeight + 1)
    }
  }, [value])

  if (!value) {
    return <span className="text-text-secondary">-</span>
  }

  return (
    <>
      <div className="min-w-0 max-w-[280px]">
        <div
          ref={textRef}
          className="line-clamp-3 text-sm leading-relaxed text-text-primary"
        >
          {value}
        </div>
        {overflows && (
          <button
            onClick={() => setOpen(true)}
            className="mt-0.5 text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            Voir plus
          </button>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Rapport IA" size="lg">
        <div className="py-1">
          <ReportContent text={value} />
        </div>
      </Modal>
    </>
  )
}

export default function History() {
  const [search, setSearch] = useState('')
  const { data: history, isLoading } = useHistory()

  const filtered = (history ?? []).filter(
    (h) =>
      h.type_action.toLowerCase().includes(search.toLowerCase()) ||
      h.code_banc.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: ColumnDef<HistoryEntry>[] = [
    { accessorKey: 'id_historique', header: 'ID' },
    { accessorKey: 'code_banc', header: 'Banc' },
    { accessorKey: 'type_action', header: 'Action' },
    {
      accessorKey: 'date_cloture', header: 'Date clôture',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('fr-FR'),
    },
    {
      accessorKey: 'mttr_calcule', header: 'MTTR (min)',
      cell: ({ getValue }) => (getValue() as number)?.toString() ?? '-',
    },
    {
      accessorKey: 'rapport_clean_ia', header: 'Rapport IA',
      cell: ({ getValue }) => <RapportCell value={getValue() as string | undefined} />,
    },
  ]

  return (
    <div>
      <PageHeader title="Historique" description="Historique des interventions" />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher dans l'historique..." />
      </div>
      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucun historique" />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={10} />
      )}
    </div>
  )
}
