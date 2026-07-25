export interface Ticket {
  id_ticket: number
  code_banc: string
  symptome: string
  criticite: string
  date_creation: string
  statut: string
  banc_nom?: string
  banc_emplacement?: string
  banc_statut?: string
}

export interface CreateTicketPayload {
  code_banc: string
  symptome: string
  criticite?: string
  statut?: string
}

export interface UpdateTicketPayload {
  symptome?: string
  criticite?: string
  statut?: string
}
