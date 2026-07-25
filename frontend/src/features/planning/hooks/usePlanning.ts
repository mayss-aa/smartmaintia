import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { planningService } from '@/features/planning/services/planning.service'
import type { UpdatePlanningPayload } from '@/types/planning'

export function usePlanning() {
  return useQuery({ queryKey: ['planning'], queryFn: () => planningService.getAll() })
}
export function useUpdatePlanning() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id: number; payload: UpdatePlanningPayload }) => planningService.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['planning'] }) })
}
