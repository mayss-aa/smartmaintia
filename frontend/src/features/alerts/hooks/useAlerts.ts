import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsService } from '@/features/alerts/services/alerts.service'
import type { CreateAlertPayload, UpdateAlertPayload } from '@/types/alert'

export function useAlerts() {
  return useQuery({ queryKey: ['alerts'], queryFn: () => alertsService.getAll() })
}
export function useAlert(id: number) {
  return useQuery({ queryKey: ['alert', id], queryFn: () => alertsService.getById(id), enabled: !!id })
}
export function useCreateAlert() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (p: CreateAlertPayload) => alertsService.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) })
}
export function useUpdateAlert() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id: number; payload: UpdateAlertPayload }) => alertsService.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) })
}
export function useDeleteAlert() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => alertsService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) })
}
