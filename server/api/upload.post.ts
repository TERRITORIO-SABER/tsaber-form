import axios from 'axios'

export default defineEventHandler(async (event) => {
  const form = (await readMultipartFormData(event)) || []
  const imageFile = form[0]
  if (!imageFile) return
  const config = useRuntimeConfig()
  const res = uploadImageToZendesk(
    imageFile,
    config.ZendeskUser,
    config.ZendeskToken
  )
  return res
})

const uploadImageToZendesk = async (
  imageFile: any,
  zendeskUsername: any,
  zendeskToken: any
) => {
  const zendeskUrl = `https://territoriosaber.zendesk.com/api/v2/uploads.json?filename=${imageFile.filename}` // Replace 'yoursubdomain' with your Zendesk subdomain

  try {
    
    const res = await axios({
      method: 'POST',
      url: zendeskUrl,
      data: imageFile,
      headers: {
        'Content-Type': 'application/binary',
        Authorization: 'Basic ' + btoa(zendeskUsername + ':' + zendeskToken)
      }
    })

    return { token: res.data.upload.token }
  } catch (error) {
    console.log(error)
    throw error
  }
}
