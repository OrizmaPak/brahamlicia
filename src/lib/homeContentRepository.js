import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase.js'

const homePageRef = () => doc(db, 'sitePages', 'home')

function userMetadata(user) {
  return {
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
    uid: user?.uid ?? '',
  }
}

export function subscribeHomeContent(onChange, onError) {
  if (!isFirebaseConfigured || !db) {
    onChange({ fields: {}, source: 'fallback' })
    return () => {}
  }

  return onSnapshot(
    homePageRef(),
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange({ fields: {}, source: 'fallback' })
        return
      }

      onChange({ fields: snapshot.data().fields ?? {}, source: 'firestore' })
    },
    (error) => {
      onError?.(error)
      onChange({ fields: {}, source: 'fallback' })
    },
  )
}

export async function saveHomeField(fieldKey, fieldValue, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  await runTransaction(db, async (transaction) => {
    const pageRef = homePageRef()
    const pageSnapshot = await transaction.get(pageRef)
    const editor = userMetadata(user)

    if (pageSnapshot.exists()) {
      const revisionRef = doc(collection(db, 'sitePageRevisions', 'home', 'items'))
      transaction.set(revisionRef, {
        ...pageSnapshot.data(),
        createdAt: serverTimestamp(),
        createdBy: editor,
        revisionOf: 'sitePages/home',
      })
    }

    transaction.set(
      pageRef,
      {
        fields: {
          [fieldKey]: fieldValue,
        },
        updatedAt: serverTimestamp(),
        updatedBy: editor,
      },
      { merge: true },
    )
  })
}

export async function seedHomeContent(fields, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  const editor = userMetadata(user)
  const pageRef = homePageRef()
  const existing = await getDoc(pageRef)

  if (existing.exists()) {
    await addDoc(collection(db, 'sitePageRevisions', 'home', 'items'), {
      ...existing.data(),
      createdAt: serverTimestamp(),
      createdBy: editor,
      revisionOf: 'sitePages/home',
    })
  }

  await setDoc(
    pageRef,
    {
      fields,
      updatedAt: serverTimestamp(),
      updatedBy: editor,
    },
    { merge: true },
  )
}

export async function submitEnquiry(payload) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  await addDoc(collection(db, 'enquiries'), {
    ...payload,
    createdAt: serverTimestamp(),
    source: 'website',
    status: 'new',
  })
}

export async function saveMediaAsset(asset, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  await addDoc(collection(db, 'mediaAssets'), {
    alt: asset.alt ?? '',
    bytes: asset.bytes ?? null,
    createdAt: serverTimestamp(),
    createdBy: userMetadata(user),
    folder: asset.folder ?? 'brahamlicia/home',
    format: asset.format ?? '',
    height: asset.height ?? null,
    public_id: asset.publicId,
    secure_url: asset.secureUrl,
    width: asset.width ?? null,
  })
}

export function subscribeEnquiries(onChange, onError) {
  if (!isFirebaseConfigured || !db) {
    onChange([])
    return () => {}
  }

  const enquiriesQuery = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(50))

  return onSnapshot(
    enquiriesQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    },
    (error) => {
      onError?.(error)
      onChange([])
    },
  )
}
