export enum FormsID {
  UserForm = '22711355970587',
  AgentForm = '222739681924507'
}

export interface FormData {
  formId: FormsID
  email: string
  messageTitle: string
  description: string
  requestType: string
  subject: string
  fullName: string
  cpf?: string
  phone?: string
  orderNumber?: string
  fileToken?: string
  fileName?: string
}

export interface TicketData {
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
