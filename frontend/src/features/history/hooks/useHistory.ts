import { useQuery } from '@tanstack/react-query'
import { historyService } from '@/features/history/services/history.service'

export function useHistory() {
  return useQuery({ queryKey: ['history'], queryFn: () => historyService.getAll() })
}
export function useHistoryEntry(id: number) {
  return useQuery({ queryKey: ['history', id], queryFn: () => historyService.getById(id), enabled: !!id })
}
