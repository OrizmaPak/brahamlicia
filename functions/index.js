import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { v2 as cloudinary } from 'cloudinary'

initializeApp()

const db = getFirestore()
const cloudinaryCloudName = defineSecret('CLOUDINARY_CLOUD_NAME')
const cloudinaryApiKey = defineSecret('CLOUDINARY_API_KEY')
const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET')

const allowedAdminEmails = new Set(['orevaorior@gmail.com', 'jovisamblue@gmail.com'])

function cleanFolder(folder) {
  const requestedFolder = typeof folder === 'string' && folder.trim() ? folder.trim() : 'brahamlicia/home'
  const sanitizedFolder = requestedFolder.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 90)

  if (!sanitizedFolder.startsWith('brahamlicia/home')) {
    return 'brahamlicia/home'
  }

  return sanitizedFolder
}

async function assertAdmin(request) {
  const uid = request.auth?.uid
  const email = request.auth?.token?.email?.toLowerCase()

  if (!uid || !email) {
    throw new HttpsError('unauthenticated', 'Sign in with an allowed Google account first.')
  }

  const adminSnapshot = await db.doc(`admins/${uid}`).get()
  const hasAdminRecord = adminSnapshot.exists && adminSnapshot.data()?.disabled !== true

  if (!allowedAdminEmails.has(email) && !hasAdminRecord) {
    throw new HttpsError('permission-denied', 'This account is not allowed to upload CMS images.')
  }

  return { email, uid }
}

export const createCloudinaryUploadSignature = onCall(
  {
    cors: true,
    maxInstances: 5,
    region: 'us-central1',
    secrets: [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret],
  },
  async (request) => {
    await assertAdmin(request)
    const cloudName = cloudinaryCloudName.value()
    const apiKey = cloudinaryApiKey.value()
    const apiSecret = cloudinaryApiSecret.value()

    if (!cloudName || !apiKey || !apiSecret) {
      throw new HttpsError('failed-precondition', 'Cloudinary secrets are not configured.')
    }

    const folder = cleanFolder(request.data?.folder)
    const timestamp = Math.round(Date.now() / 1000)

    cloudinary.config({
      api_key: apiKey,
      api_secret: apiSecret,
      cloud_name: cloudName,
      secure: true,
    })

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      apiSecret,
    )

    return {
      apiKey,
      cloudName,
      folder,
      signature,
      timestamp,
    }
  },
)
