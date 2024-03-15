export type FormData = {
  email: string
  messageTitle: string
  description: string
  requestType: string
  subject: string
  fullName: string
  cpf: string
  phone: string
  orderNumber?: string,
  fileToken?: string,
  fileName?: string
}

export type TicketData = {
  ticket_form_id: string
  subject: string
  description: string
  requester: {
    email: string
    name: string
  }
  custom_fields: {
    id: string
    value: string
  }[]
  comment?: {
    body: string
    uploads: string[]
  }
}