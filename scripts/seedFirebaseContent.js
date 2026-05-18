import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { defaultSiteContent } from '../src/content/defaultContent.js'

const sections = [
  ['services', 'serviceOfferings'],
  ['testimonials', 'testimonials'],
  ['faqs', 'faqItems'],
  ['audiences', 'audiences'],
  ['insights', 'insights'],
]

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...valueParts] = line.split('=')
        return [key, valueParts.join('=').replace(/^"|"$/g, '')]
      }),
  )
}

function cleanData(value) {
  if (Array.isArray(value)) return value.map(cleanData)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, cleanData(entryValue)]),
    )
  }

  return value
}

function slugify(value) {
  return String(value ?? 'item')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `item-${Date.now()}`
}

const env = {
  ...loadEnvFile(resolve('.env')),
  ...loadEnvFile(resolve('.env.local')),
  ...process.env,
}

const projectId = env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID
const serviceAccountPath = env.FIREBASE_SERVICE_ACCOUNT_PATH

if (!projectId) {
  throw new Error('Missing FIREBASE_PROJECT_ID or VITE_FIREBASE_PROJECT_ID.')
}

const credential = serviceAccountPath
  ? cert(JSON.parse(readFileSync(resolve(serviceAccountPath), 'utf8')))
  : applicationDefault()

initializeApp({ credential, projectId })

const db = getFirestore()
const batch = db.batch()
const timestamp = FieldValue.serverTimestamp()

function itemRef(scope, section, id) {
  return db.doc(`${scope}/${section}/items/${id}`)
}

const settingsPayload = cleanData(defaultSiteContent.siteConfig)
batch.set(itemRef('cmsDrafts', 'settings', 'general'), {
  ...settingsPayload,
  updatedAt: timestamp,
})
batch.set(itemRef('publishedContent', 'settings', 'general'), {
  ...settingsPayload,
  publishedAt: timestamp,
  updatedAt: timestamp,
})

sections.forEach(([sectionName, contentKey]) => {
  const items = defaultSiteContent[contentKey] ?? []

  items.forEach((item, index) => {
    const id = item.id ?? item.anchor ?? slugify(item.title ?? item.question ?? item.author)
    const payload = cleanData({
      ...item,
      order: item.order ?? index,
      published: true,
    })
    delete payload.id

    batch.set(itemRef('cmsDrafts', sectionName, id), {
      ...payload,
      publishedAt: timestamp,
      updatedAt: timestamp,
    }, { merge: true })
    batch.set(itemRef('publishedContent', sectionName, id), {
      ...payload,
      publishedAt: timestamp,
      updatedAt: timestamp,
    }, { merge: true })
  })
})

await batch.commit()
console.log('Seeded default content into Firestore drafts and published content.')
