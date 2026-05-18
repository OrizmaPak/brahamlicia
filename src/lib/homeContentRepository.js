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
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase.js'

function pageRef(pageId) {
  return doc(db, 'sitePages', pageId)
}

function revisionCollection(pageId) {
  return collection(db, 'sitePageRevisions', pageId, 'items')
}

function userMetadata(user) {
  return {
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
    uid: user?.uid ?? '',
  }
}

export function subscribePageContent(pageId, onChange, onError) {
  if (!isFirebaseConfigured || !db) {
    onChange({ fields: {}, source: 'fallback' })
    return () => {}
  }

  return onSnapshot(
    pageRef(pageId),
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

export async function savePageField(pageId, fieldKey, fieldValue, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  await runTransaction(db, async (transaction) => {
    const currentPageRef = pageRef(pageId)
    const pageSnapshot = await transaction.get(currentPageRef)
    const editor = userMetadata(user)

    if (pageSnapshot.exists()) {
      const revisionRef = doc(revisionCollection(pageId))
      transaction.set(revisionRef, {
        ...pageSnapshot.data(),
        createdAt: serverTimestamp(),
        createdBy: editor,
        revisionOf: `sitePages/${pageId}`,
      })
    }

    transaction.set(
      currentPageRef,
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

export async function seedPageContent(pageId, fields, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  const editor = userMetadata(user)
  const currentPageRef = pageRef(pageId)
  const existing = await getDoc(currentPageRef)

  if (existing.exists()) {
    await addDoc(revisionCollection(pageId), {
      ...existing.data(),
      createdAt: serverTimestamp(),
      createdBy: editor,
      revisionOf: `sitePages/${pageId}`,
    })
  }

  await setDoc(
    currentPageRef,
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
    archived: false,
    createdAt: serverTimestamp(),
    notes: [],
    source: 'website',
    status: 'Not attended',
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

export function subscribeEnquiryStatuses(onChange, onError) {
  if (!isFirebaseConfigured || !db) {
    onChange([])
    return () => {}
  }

  const statusesQuery = query(collection(db, 'enquiryStatuses'), orderBy('label', 'asc'))

  return onSnapshot(
    statusesQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    },
    (error) => {
      onError?.(error)
      onChange([])
    },
  )
}

export async function createEnquiryStatus(label, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  const safeLabel = label.trim()
  if (!safeLabel) {
    throw new Error('Status label cannot be empty.')
  }

  await addDoc(collection(db, 'enquiryStatuses'), {
    createdAt: serverTimestamp(),
    createdBy: userMetadata(user),
    label: safeLabel,
  })
}

export async function updateEnquiryStatus(enquiryId, status, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  const safeStatus = status.trim()
  if (!safeStatus) {
    throw new Error('Status cannot be empty.')
  }

  await updateDoc(doc(db, 'enquiries', enquiryId), {
    status: safeStatus,
    updatedAt: serverTimestamp(),
    updatedBy: userMetadata(user),
  })
}

export async function addEnquiryNote(enquiryId, note, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  const safeNote = note.trim()
  if (!safeNote) {
    throw new Error('Note cannot be empty.')
  }

  const enquiryDocRef = doc(db, 'enquiries', enquiryId)
  const enquirySnapshot = await getDoc(enquiryDocRef)
  const existingNotes = enquirySnapshot.data()?.notes ?? []

  await updateDoc(enquiryDocRef, {
    notes: [
      ...existingNotes,
      {
        author: user?.email ?? '',
        createdAt: new Date().toISOString(),
        text: safeNote,
      },
    ],
    updatedAt: serverTimestamp(),
    updatedBy: userMetadata(user),
  })
}

export async function setEnquiryArchived(enquiryId, archived, user) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured for this environment.')
  }

  await updateDoc(doc(db, 'enquiries', enquiryId), {
    archived,
    updatedAt: serverTimestamp(),
    updatedBy: userMetadata(user),
  })
}
