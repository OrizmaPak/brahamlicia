import { httpsCallable } from 'firebase/functions'
import { functions, isFirebaseConfigured } from './firebase.js'

const maxImageBytes = 8 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

function validateImageFile(file) {
  if (!file) throw new Error('Choose an image file first.')
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Use a JPG, PNG, or WEBP image.')
  }
  if (file.size > maxImageBytes) {
    throw new Error('Image must be 8MB or smaller.')
  }
}

export async function uploadImageToCloudinary(file, folder = 'brahamlicia/home') {
  if (!isFirebaseConfigured || !functions) {
    throw new Error('Firebase Functions is not configured for uploads.')
  }

  validateImageFile(file)

  let data
  try {
    const createSignature = httpsCallable(functions, 'createCloudinaryUploadSignature')
    const result = await createSignature({ folder })
    data = result.data
  } catch (error) {
    throw new Error(
      error?.message ??
        'Upload signature request failed. Confirm Firebase Functions deployment and Cloudinary secrets.',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', data.apiKey)
  formData.append('timestamp', data.timestamp)
  formData.append('folder', data.folder)
  formData.append('signature', data.signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, {
    body: formData,
    method: 'POST',
  })

  const uploadResult = await response.json()

  if (!response.ok) {
    throw new Error(uploadResult?.error?.message ?? 'Cloudinary upload failed.')
  }

  return {
    bytes: uploadResult.bytes,
    format: uploadResult.format,
    height: uploadResult.height,
    publicId: uploadResult.public_id,
    secureUrl: uploadResult.secure_url,
    width: uploadResult.width,
  }
}
