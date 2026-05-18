import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { defaultSiteContent } from '../src/content/defaultContent.js'
import {
  collectImageAssets,
  editableSections,
  singletonSections,
} from '../src/content/contentModel.js'

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
const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-')

function itemRef(scope, section, id) {
  return db.doc(`${scope}/${section}/items/${id}`)
}

async function readCollection(path) {
  const snapshot = await db.collection(path).get()
  return Object.fromEntries(
    snapshot.docs.map((documentSnapshot) => [documentSnapshot.id, documentSnapshot.data()]),
  )
}

async function backupCurrentFirebaseContent() {
  const backup = {
    createdAt: new Date().toISOString(),
    mediaAssets: await readCollection('mediaAssets'),
    projectId,
    scopes: {},
  }

  for (const scope of ['cmsDrafts', 'publishedContent']) {
    backup.scopes[scope] = {
      settings: await readCollection(`${scope}/settings/items`),
    }

    for (const section of editableSections) {
      backup.scopes[scope][section.collectionName] = await readCollection(
        `${scope}/${section.collectionName}/items`,
      )
    }

    for (const section of singletonSections) {
      backup.scopes[scope][section.collectionName] = await readCollection(
        `${scope}/${section.collectionName}/items`,
      )
    }
  }

  mkdirSync(resolve('backups'), { recursive: true })
  const backupPath = resolve('backups', `firebase-content-backup-${backupTimestamp}.json`)
  writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8')
  console.log(`Backed up current Firebase content to ${backupPath}`)
}

await backupCurrentFirebaseContent()

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

editableSections.forEach((section) => {
  const items = defaultSiteContent[section.contentKey] ?? []

  items.forEach((item, index) => {
    const id = item.id ?? item.anchor ?? slugify(item.title ?? item.question ?? item.author)
    const payload = cleanData({
      ...item,
      order: item.order ?? index,
      published: true,
    })
    delete payload.id

    batch.set(itemRef('cmsDrafts', section.collectionName, id), {
      ...payload,
      publishedAt: timestamp,
      updatedAt: timestamp,
    }, { merge: true })
    batch.set(itemRef('publishedContent', section.collectionName, id), {
      ...payload,
      publishedAt: timestamp,
      updatedAt: timestamp,
    }, { merge: true })
  })
})

singletonSections.forEach((section) => {
  const payload = {
    publishedAt: timestamp,
    updatedAt: timestamp,
    value: cleanData(defaultSiteContent[section.contentKey]),
  }

  batch.set(itemRef('cmsDrafts', section.collectionName, 'general'), payload, { merge: true })
  batch.set(itemRef('publishedContent', section.collectionName, 'general'), payload, { merge: true })
})

collectImageAssets(defaultSiteContent).forEach((asset) => {
  batch.set(db.doc(`mediaAssets/${slugify(asset.sourcePath || asset.src)}`), {
    alt: asset.alt,
    createdAt: timestamp,
    sourcePath: asset.sourcePath,
    src: asset.src,
    type: 'seeded-reference',
    updatedAt: timestamp,
  }, { merge: true })
})

await batch.commit()
console.log('Seeded all default content and image references into Firestore.')
