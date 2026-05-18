import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { isAllowlistedAdminEmail } from './adminAccess.js'

export const editableSections = [
  {
    collectionName: 'services',
    contentKey: 'serviceOfferings',
    label: 'Services',
    singularLabel: 'Service',
  },
  {
    collectionName: 'testimonials',
    contentKey: 'testimonials',
    label: 'Testimonials',
    singularLabel: 'Testimonial',
  },
  {
    collectionName: 'faqs',
    contentKey: 'faqItems',
    label: 'FAQs',
    singularLabel: 'FAQ',
  },
  {
    collectionName: 'audiences',
    contentKey: 'audiences',
    label: 'Audiences',
    singularLabel: 'Audience',
  },
  {
    collectionName: 'insights',
    contentKey: 'insights',
    label: 'Insights',
    singularLabel: 'Insight',
  },
]

const sectionByCollection = new Map(
  editableSections.map((section) => [section.collectionName, section]),
)

function requireDb() {
  if (!db) {
    throw new Error('Firebase is not configured.')
  }

  return db
}

function cleanFirestoreData(data) {
  if (Array.isArray(data)) {
    return data.map(cleanFirestoreData)
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, cleanFirestoreData(value)]),
    )
  }

  return data
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 9999
    const orderB = Number.isFinite(b.order) ? b.order : 9999

    if (orderA !== orderB) return orderA - orderB

    return String(a.title ?? a.question ?? a.author ?? a.id).localeCompare(
      String(b.title ?? b.question ?? b.author ?? b.id),
    )
  })
}

function snapshotItems(snapshot, { onlyPublished = true } = {}) {
  return sortItems(
    snapshot.docs
      .map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }))
      .filter((item) => !onlyPublished || item.published !== false),
  )
}

function collectionRef(scope, section) {
  return collection(requireDb(), scope, section, 'items')
}

function itemRef(scope, section, id) {
  return doc(requireDb(), scope, section, 'items', id)
}

function settingsRef(scope) {
  return doc(requireDb(), scope, 'settings', 'items', 'general')
}

export function subscribeToPublishedContent(onChange, onError) {
  if (!db) return () => {}

  const state = {}
  const emit = () => onChange({ ...state })
  const unsubscribers = [
    onSnapshot(
      settingsRef('publishedContent'),
      (snapshot) => {
        if (snapshot.exists()) {
          state.siteConfig = snapshot.data()
          emit()
        }
      },
      onError,
    ),
  ]

  editableSections.forEach((section) => {
    const sectionQuery = query(
      collectionRef('publishedContent', section.collectionName),
      orderBy('order', 'asc'),
    )

    unsubscribers.push(
      onSnapshot(
        sectionQuery,
        (snapshot) => {
          state[section.contentKey] = snapshotItems(snapshot)
          emit()
        },
        onError,
      ),
    )
  })

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
  }
}

export function subscribeToSettings(scope, onChange, onError) {
  if (!db) return () => {}

  return onSnapshot(
    settingsRef(scope),
    (snapshot) => {
      onChange(snapshot.exists() ? { id: 'general', ...snapshot.data() } : null)
    },
    onError,
  )
}

export function subscribeToSection(scope, sectionName, onChange, onError) {
  if (!db) return () => {}

  const section = sectionByCollection.get(sectionName)
  if (!section) throw new Error(`Unknown CMS section: ${sectionName}`)

  return onSnapshot(
    query(collectionRef(scope, sectionName), orderBy('order', 'asc')),
    (snapshot) => onChange(snapshotItems(snapshot, { onlyPublished: scope === 'publishedContent' })),
    onError,
  )
}

export async function isAdminUser(uid, email) {
  if (isAllowlistedAdminEmail(email)) return true
  if (!uid) return false

  const snapshot = await getDoc(doc(requireDb(), 'admins', uid))
  return snapshot.exists()
}

export async function saveDraftSettings(settings) {
  const payload = cleanFirestoreData(settings)
  payload.updatedAt = serverTimestamp()

  await setDoc(
    settingsRef('cmsDrafts'),
    payload,
    { merge: true },
  )
}

export async function publishSettings(settings) {
  const payload = cleanFirestoreData(settings)
  payload.publishedAt = serverTimestamp()
  payload.updatedAt = serverTimestamp()

  await Promise.all([
    setDoc(settingsRef('cmsDrafts'), payload, { merge: true }),
    setDoc(settingsRef('publishedContent'), payload, { merge: true }),
  ])
}

export async function saveDraftItem(sectionName, item) {
  const id = item.id
  if (!id) throw new Error('A content item needs an id before it can be saved.')

  const payload = cleanFirestoreData(item)
  delete payload.id
  payload.updatedAt = serverTimestamp()

  await setDoc(itemRef('cmsDrafts', sectionName, id), payload, { merge: true })
}

export async function publishDraftItem(sectionName, item) {
  const id = item.id
  if (!id) throw new Error('A content item needs an id before it can be published.')

  const payload = cleanFirestoreData(item)
  delete payload.id
  payload.published = true
  payload.publishedAt = serverTimestamp()
  payload.updatedAt = serverTimestamp()

  await Promise.all([
    setDoc(itemRef('cmsDrafts', sectionName, id), payload, { merge: true }),
    setDoc(itemRef('publishedContent', sectionName, id), payload, { merge: true }),
  ])
}

export async function unpublishItem(sectionName, id) {
  await deleteDoc(itemRef('publishedContent', sectionName, id))
}

export async function deleteContentItem(sectionName, id) {
  await Promise.all([
    deleteDoc(itemRef('cmsDrafts', sectionName, id)),
    deleteDoc(itemRef('publishedContent', sectionName, id)),
  ])
}

export async function saveMediaAsset(asset) {
  const payload = cleanFirestoreData(asset)
  payload.createdAt = serverTimestamp()
  payload.updatedAt = serverTimestamp()

  const reference = await addDoc(collection(requireDb(), 'mediaAssets'), payload)
  return reference.id
}

export async function submitEnquiry(formData) {
  if (!db) return { fallback: true }

  await addDoc(collection(db, 'enquiries'), {
    createdAt: serverTimestamp(),
    description: formData.description,
    email: formData.email,
    name: formData.name,
    nextStep: formData.nextStep,
    organisation: formData.organisation,
    phone: formData.phone,
    service: formData.service,
    source: 'website',
    status: 'new',
  })

  return { fallback: false }
}

export async function seedContentToFirestore(content) {
  const firestore = requireDb()
  const batch = writeBatch(firestore)

  const settingsPayload = cleanFirestoreData(content.siteConfig)
  batch.set(settingsRef('cmsDrafts'), {
    ...settingsPayload,
    updatedAt: serverTimestamp(),
  })
  batch.set(settingsRef('publishedContent'), {
    ...settingsPayload,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  editableSections.forEach((section) => {
    const items = content[section.contentKey] ?? []

    items.forEach((item, index) => {
      const id = item.id ?? item.anchor ?? slugify(item.title ?? item.question ?? item.author)
      const payload = cleanFirestoreData({
        ...item,
        order: item.order ?? index,
        published: true,
      })
      delete payload.id
      payload.publishedAt = serverTimestamp()
      payload.updatedAt = serverTimestamp()

      batch.set(itemRef('cmsDrafts', section.collectionName, id), payload, { merge: true })
      batch.set(itemRef('publishedContent', section.collectionName, id), payload, { merge: true })
    })
  })

  await batch.commit()
}

export async function getEnquiries() {
  const snapshot = await getDocs(query(collection(requireDb(), 'enquiries'), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }))
}

export function slugify(value) {
  return String(value ?? 'item')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `item-${Date.now()}`
}
