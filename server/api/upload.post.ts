export default defineEventHandler(async (event) => {
  const form = (await readMultipartFormData(event)) || []
  const config = useRuntimeConfig()
  const res = await uploadImageToZendesk(
    form,
    config.ZendeskUser,
    config.ZendeskToken
  )
  return res
})

const uploadImageToZendesk = async (
  form: any,
  zendeskUsername: any,
  zendeskToken: any
) => {
  const zendeskUrl = `https://territoriosaber.zendesk.com/api/v2/uploads.json?filename=${form[0].filename}`
  try {
    const res = await fetch(zendeskUrl, {
      method: 'POST',
      body: form[0].data,
      headers: {
        Authorization: 'Basic ' + btoa(zendeskUsername + ':' + zendeskToken),
        'Content-Type': 'image/png'
      }
    })
    const data = await res.json()
    console.log('Upload successful', data.upload.attachment.url)
    return { token: data.upload.token as string }
  } catch (error) {
    console.log(error)
    throw error
  }
}
