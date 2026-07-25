import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTicket } from '@/features/tickets/hooks/useTickets'
import { useTestBenches } from '@/features/test-benches/hooks/useTestBenches'
import type { TestBench } from '@/features/test-benches/services/test-benches.service'
import { PageHeader } from '@/components/common/PageHeader'
import { Loader } from '@/components/feedback/Loader'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/feedback/Toast'

const incidentSchema = z.object({
  code_banc: z.string().min(1, 'Le banc est obligatoire'),
  symptome: z.string().min(1, 'La description est obligatoire'),
  criticite: z.string().default('MOYENNE'),
})

function benchOptionLabel(bench: TestBench): string {
  return bench.code_banc && bench.nom
    ? `${bench.code_banc} — ${bench.nom}`
    : bench.code_banc || bench.nom || bench.emplacement
}

export default function Incident() {
  const createMutation = useCreateTicket()
  const { data: benches, isLoading: benchesLoading, isError: benchesError } = useTestBenches()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incidentSchema),
    defaultValues: { code_banc: '', symptome: '', criticite: 'MOYENNE' },
  })

  const onSubmit = (data: { code_banc: string; symptome: string; criticite: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset()
        toast.addToast('Votre déclaration a été enregistrée. Le service maintenance a été notifié.', 'success')
        navigate(ROUTES.TICKETS)
      },
      onError: (err) => toast.addToast(err?.message ?? 'Erreur lors de la déclaration', 'error'),
    })
  }

  return (
    <div>
      <PageHeader
        title="Déclaration rapide de panne"
        description="Signalez une panne ou un dysfonctionnement observé sur un banc de test."
      />

      <div className="mx-auto px-0 px-sm-3" style={{ maxWidth: '720px' }}>
        <div className="rounded-fluid border border-border bg-white p-4 sm:p-5 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
                Banc de test
              </label>
              {benchesLoading ? (
                <div className="flex items-center gap-2 rounded-fluid border border-border bg-white px-3 text-fluid-sm text-text-secondary" style={{ height: '42px' }}>
                  <Loader className="h-4 w-4" />
                  Chargement des bancs...
                </div>
              ) : benchesError ? (
                <div className="rounded-fluid border border-border px-3 py-2 text-fluid-sm text-error" style={{ backgroundColor: 'rgba(239,68,68,0.05)' }}>
                  Impossible de charger la liste des bancs.
                </div>
              ) : (
                <select
                  {...register('code_banc')}
                  className={`h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${errors.code_banc ? 'border-error' : ''}`}
                >
                  <option value="">Sélectionnez un banc...</option>
                  {(benches ?? []).map((bench) => (
                    <option key={bench.code_banc} value={bench.code_banc}>
                      {benchOptionLabel(bench)}
                    </option>
                  ))}
                </select>
              )}
              {errors.code_banc && (
                <div className="mt-1 text-fluid-sm text-error">{errors.code_banc.message}</div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
                Description de l'incident
              </label>
              <textarea
                {...register('symptome')}
                rows={5}
                placeholder="Décrivez l'incident rencontré..."
                className={`w-full resize-none rounded-fluid border border-border bg-white px-3 py-2 text-fluid-base text-text-primary placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none ${errors.symptome ? 'border-error' : ''}`}
              />
              {errors.symptome && (
                <div className="mt-1 text-fluid-sm text-error">{errors.symptome.message}</div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-fluid-sm font-medium text-text-primary">
                Criticité
              </label>
              <select
                {...register('criticite')}
                className="h-ctrl w-full appearance-none rounded-fluid border border-border bg-white px-3 text-fluid-base text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              >
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
                <option value="CRITIQUE">Critique</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-fluid p-3 text-fluid-sm" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}>
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Après déclaration, le service maintenance est automatiquement notifié.</span>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || benchesLoading || benchesError || (benches ?? []).length === 0}
              className="inline-flex h-ctrl w-full items-center justify-center gap-2 rounded-fluid bg-error px-4 text-fluid-sm font-medium text-white shadow-btn hover:bg-red-600 hover:shadow-btn-hover transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Envoi...' : 'Envoyer l\'alerte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
