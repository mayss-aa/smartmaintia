import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { interventionsService } from '@/features/interventions/services/interventions.service'
import type { CreateInterventionPayload, UpdateInterventionPayload, CompleteInterventionPayload } from '@/types/intervention'

export function useInterventions() {
  return useQuery({ queryKey: ['interventions'], queryFn: () => interventionsService.getAll() })
}
export function useMyInterventions() {
  return useQuery({ queryKey: ['my-interventions'], queryFn: () => interventionsService.getMine() })
}
export function useIntervention(id: number) {
  return useQuery({ queryKey: ['intervention', id], queryFn: () => interventionsService.getById(id), enabled: !!id })
}
export function useCreateIntervention() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (p: CreateInterventionPayload) => interventionsService.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['interventions'] }) })
}
export function useUpdateIntervention() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id: number; payload: UpdateInterventionPayload }) => interventionsService.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['interventions'] }) })
}
export function useStartIntervention() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => interventionsService.start(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['interventions'] }) })
}
export function useCompleteIntervention() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id: number; payload: CompleteInterventionPayload }) => interventionsService.complete(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['interventions'] }) })
}
export function useDeleteIntervention() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => interventionsService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['interventions'] }) })
}
