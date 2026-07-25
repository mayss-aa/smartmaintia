import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsService } from '@/features/tickets/services/tickets.service'
import type { CreateTicketPayload, UpdateTicketPayload } from '@/types/ticket'

export function useTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: () => ticketsService.getAll() })
}
export function useTicket(id: number) {
  return useQuery({ queryKey: ['ticket', id], queryFn: () => ticketsService.getById(id), enabled: !!id })
}
export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (p: CreateTicketPayload) => ticketsService.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) })
}
export function useUpdateTicket() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id: number; payload: UpdateTicketPayload }) => ticketsService.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) })
}
export function useDeleteTicket() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => ticketsService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) })
}
