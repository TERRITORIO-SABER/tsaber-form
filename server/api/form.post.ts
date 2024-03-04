type FormData = {
  email: string
  messageTitle: string
  description: string
  requestType: string
  subject: string
  fullName: string
  cpf: string
  phone: string
  orderNumber?: string
  // requestAttachments: {
  //   name: string
  // }
  // fileToken: string
}
type TicketData = {
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

export default defineEventHandler(async (event) => {
  const body: FormData = await readBody(event)

  const ticketData: TicketData = {
    ticket_form_id: '22711355970587',
    subject: body.messageTitle,
    description: body.description,
    requester: { email: body.email, name: body.fullName },
    // Add any other necessary fields here
    custom_fields: [
      { id: '23142701419931', value: body.messageTitle },
      { id: '23142561504795', value: body.cpf },
      { id: '23142638169883', value: body.phone },
      { id: '23018418373275', value: body.fullName },
      { id: '23139054906779', value: body.requestType },
      { id: '23142330836891', value: body.subject }
    ]
  }

  body.orderNumber &&
    ticketData.custom_fields.push({
      id: '23142687375259',
      value: body.orderNumber
    })

  // if (body.fileToken) {
  //   ticketData.comment = {
  //     body: body.requestAttachments.name,
  //     uploads: [body.fileToken]
  //   }
  // }

  const config = useRuntimeConfig()
  const res = await createZendeskTicket(
    ticketData,
    config.ZendeskUser,
    config.ZendeskToken
  )
  return res
})

const createZendeskTicket = async (
  ticketData: any,
  zendeskUsername: any,
  zendeskToken: any
) => {
  const zendeskUrl = 'https://territoriosaber.zendesk.com/api/v2/tickets'

  try {
    const response = await fetch(zendeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(zendeskUsername + ':' + zendeskToken)
      },
      body: JSON.stringify({ ticket: ticketData })
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Failed to create Zendesk ticket: ${errorMessage}`)
    }

    const responseData = await response.json()
    console.log('Zendesk ticket created successfully:', responseData)
    return responseData // Return the created ticket data
  } catch (error) {
    console.error('Error creating Zendesk ticket:', error)
    throw error // Rethrow the error to handle it further if needed
  }
}
