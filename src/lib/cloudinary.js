import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase.js'

const maxImageSize = 8 * 1024 * 1024
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function uploadImageToCloudinary(file, folder = 'site-media') {
  if (!functions) {
    throw new Error('Firebase Functions are not configured.')
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error('Upload a JPG, PNG, or WEBP image.')
  }

  if (file.size > maxImageSize) {
    throw new Error('Image must be 8MB or smaller.')
  }

  const createSignature = httpsCallable(functions, 'createCloudinaryUploadSignature')
  const { data } = await createSignature({ folder })

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', data.apiKey)
  formData.append('folder', data.folder)
  formData.append('signature', data.signature)
  formData.append('tags', data.tags)
  formData.append('timestamp', String(data.timestamp))

  const response = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, {
    body: formData,
    method: 'POST',
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Cloudinary upload failed.')
  }

  return {
    bytes: payload.bytes,
    format: payload.format,
    height: payload.height,
    publicId: payload.public_id,
    secureUrl: payload.secure_url,
    width: payload.width,
  }
}
