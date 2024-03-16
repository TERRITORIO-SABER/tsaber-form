import { FormData, TicketData, FormsID } from './types'

export default defineEventHandler(async (event) => {
  const body: FormData = await readBody(event)
  if (body.formId === FormsID.UserForm && (!body.cpf || !body.phone)) {
    throw new Error('Missing information from user')
  }
  const ticketData: TicketData = {
    ticket_form_id: body.formId,
    subject: body.messageTitle,
    description: body.description,
    requester: { email: body.email, name: body.fullName },
    // Add any other necessary fields here
    custom_fields: [
      { id: '23142701419931', value: body.messageTitle },
      { id: '23018418373275', value: body.fullName },
      { id: '23139054906779', value: body.requestType },
      { id: '23142330836891', value: body.subject }
    ]
  }

  body.cpf &&
    ticketData.custom_fields.push({
      id: '23142561504795',
      value: body.cpf
    })

  body.phone &&
    ticketData.custom_fields.push({
      id: '23142638169883',
      value: body.phone
    })

  body.orderNumber &&
    ticketData.custom_fields.push({
      id: '23142687375259',
      value: body.orderNumber
    })

  body.fileToken &&
    (ticketData.comment = {
      body: body.description,
      uploads: [body.fileToken]
    })

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
