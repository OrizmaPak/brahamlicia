import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { v2 as cloudinary } from 'cloudinary'

initializeApp()

const db = getFirestore()
const cloudinaryCloudName = defineSecret('CLOUDINARY_CLOUD_NAME')
const cloudinaryApiKey = defineSecret('CLOUDINARY_API_KEY')
const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET')
const allowlistedAdminEmails = new Set([
  'orevaorior@gmail.com',
  'jovisamblue@gmail.com',
])

function cleanFolder(value) {
  const fallback = 'braham-licia/site-media'
  if (typeof value !== 'string' || !value.trim()) return fallback

  const safe = value
    .trim()
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, '-'))
    .join('/')

  return safe ? `braham-licia/${safe.replace(/^braham-licia\//, '')}` : fallback
}

function isAllowlistedEmail(email) {
  return typeof email === 'string' && allowlistedAdminEmails.has(email.trim().toLowerCase())
}

async function assertAdmin(uid, email) {
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in.')
  }

  if (isAllowlistedEmail(email)) return

  const adminDoc = await db.doc(`admins/${uid}`).get()
  if (!adminDoc.exists) {
    throw new HttpsError('permission-denied', 'This account is not allowed to upload media.')
  }
}

export const createCloudinaryUploadSignature = onCall(
  {
    cors: true,
    maxInstances: 10,
    secrets: [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret],
  },
  async (request) => {
    await assertAdmin(request.auth?.uid, request.auth?.token?.email)

    const timestamp = Math.round(Date.now() / 1000)
    const folder = cleanFolder(request.data?.folder)
    const tags = 'braham-licia,cms'
    const uploadParams = { folder, tags, timestamp }

    cloudinary.config({
      cloud_name: cloudinaryCloudName.value(),
      api_key: cloudinaryApiKey.value(),
      api_secret: cloudinaryApiSecret.value(),
    })

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      cloudinaryApiSecret.value(),
    )

    return {
      apiKey: cloudinaryApiKey.value(),
      cloudName: cloudinaryCloudName.value(),
      folder,
      signature,
      tags,
      timestamp,
    }
  },
)
