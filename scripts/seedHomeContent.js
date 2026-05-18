import { readFile } from 'node:fs/promises'
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { createHomeFallbackFields } from '../src/content/homeContentFields.js'

async function loadCredential() {
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!credentialPath) return applicationDefault()

  const rawCredential = await readFile(credentialPath, 'utf8')
  return cert(JSON.parse(rawCredential))
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'brahamlicia'

initializeApp({
  credential: await loadCredential(),
  projectId,
})

const db = getFirestore()
const pageRef = db.doc('sitePages/home')
const existing = await pageRef.get()
const seedUser = {
  displayName: 'Seed script',
  email: 'seed-script@brahamlicia.local',
  uid: 'seed-script',
}

if (existing.exists) {
  await db.collection('sitePageRevisions/home/items').add({
    ...existing.data(),
    createdAt: FieldValue.serverTimestamp(),
    createdBy: seedUser,
    revisionOf: 'sitePages/home',
  })
}

await pageRef.set(
  {
    fields: createHomeFallbackFields(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: seedUser,
  },
  { merge: true },
)

console.log(`Seeded Home content into Firestore project ${projectId}.`)
