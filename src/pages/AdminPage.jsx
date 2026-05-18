import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'
import { uploadImageToCloudinary } from '../lib/cloudinary.js'
import { defaultSiteContent } from '../content/defaultContent.js'
import {
  deleteContentItem,
  editableSections,
  getEnquiries,
  isAdminUser,
  publishDraftItem,
  publishSettings,
  saveDraftItem,
  saveDraftSettings,
  saveMediaAsset,
  seedContentToFirestore,
  slugify,
  subscribeToSection,
  subscribeToSettings,
  unpublishItem,
} from '../lib/contentRepository.js'

const settingsFields = [
  ['name', 'Company name'],
  ['domain', 'Website domain'],
  ['tagline', 'Tagline'],
  ['primaryEmail', 'Primary email'],
  ['secondaryEmail', 'Secondary email'],
  ['primaryPhone', 'Primary phone'],
  ['secondaryPhone', 'Secondary phone'],
  ['location', 'Location'],
  ['hours', 'Business hours'],
]

const sectionFields = {
  audiences: [
    { label: 'Title', name: 'title' },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Order', name: 'order', type: 'number' },
  ],
  faqs: [
    { label: 'Question', name: 'question' },
    { label: 'Answer', name: 'answer', type: 'textarea' },
    { label: 'Order', name: 'order', type: 'number' },
  ],
  insights: [
    { label: 'Title', name: 'title' },
    { label: 'Category', name: 'category' },
    { label: 'Excerpt', name: 'excerpt', type: 'textarea' },
    { label: 'Order', name: 'order', type: 'number' },
    { label: 'Image', name: 'image', type: 'image' },
  ],
  services: [
    { label: 'Title', name: 'title' },
    { label: 'Category', name: 'category' },
    { label: 'Anchor', name: 'anchor' },
    { label: 'Summary', name: 'summary', type: 'textarea' },
    { label: 'Intro', name: 'intro', type: 'textarea' },
    { label: 'Outcomes', name: 'outcomes', type: 'textarea' },
    { label: 'CTA label', name: 'ctaLabel' },
    { label: 'Points', name: 'points', type: 'array' },
    { label: 'Order', name: 'order', type: 'number' },
    { label: 'Image', name: 'image', type: 'image' },
  ],
  testimonials: [
    { label: 'Author', name: 'author' },
    { label: 'Role', name: 'role' },
    { label: 'Organisation', name: 'organisation' },
    { label: 'Quote', name: 'quote', type: 'textarea' },
    { label: 'Featured', name: 'featured', type: 'checkbox' },
    { label: 'Order', name: 'order', type: 'number' },
    { label: 'Image', name: 'image', type: 'image' },
  ],
}

function stripRuntimeFields(value) {
  if (Array.isArray(value)) {
    return value.map(stripRuntimeFields)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !['createdAt', 'updatedAt', 'publishedAt'].includes(key))
        .map(([key, itemValue]) => [key, stripRuntimeFields(itemValue)]),
    )
  }

  return value
}

function cloneItem(item) {
  return stripRuntimeFields(JSON.parse(JSON.stringify(item ?? {})))
}

function createEmptyItem(sectionName, order) {
  const id = `${sectionName}-${Date.now()}`

  const defaults = {
    audiences: {
      description: '',
      id,
      order,
      title: 'New audience',
    },
    faqs: {
      answer: '',
      id,
      order,
      question: 'New question',
    },
    insights: {
      category: 'Insight',
      excerpt: '',
      id,
      image: { alt: '', src: '' },
      order,
      title: 'New insight',
    },
    services: {
      anchor: id,
      category: 'Service',
      ctaLabel: 'Talk to Us',
      id,
      image: { alt: '', src: '' },
      intro: '',
      order,
      outcomes: '',
      points: [],
      summary: '',
      title: 'New service',
    },
    testimonials: {
      author: 'Client name',
      featured: false,
      id,
      image: { alt: '', src: '' },
      order,
      organisation: '',
      quote: '',
      role: '',
    },
  }

  return defaults[sectionName]
}

function fieldValue(item, name) {
  return name.split('.').reduce((current, key) => current?.[key], item)
}

function setFieldValue(item, name, value) {
  const keys = name.split('.')
  const next = { ...item }
  let cursor = next

  keys.slice(0, -1).forEach((key) => {
    cursor[key] = { ...(cursor[key] ?? {}) }
    cursor = cursor[key]
  })

  cursor[keys.at(-1)] = value
  return next
}

function itemTitle(item, sectionName) {
  if (sectionName === 'faqs') return item.question
  if (sectionName === 'testimonials') return item.author
  return item.title
}

function LoginPanel() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const provider = useMemo(() => {
    const authProvider = new GoogleAuthProvider()
    authProvider.setCustomParameters({ prompt: 'select_account' })
    return authProvider
  }, [])

  async function handleGoogleSignIn() {
    setError('')
    setIsSubmitting(true)

    try {
      await signInWithPopup(auth, provider)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-shell admin-shell--login">
      <section className="admin-login">
        <p className="admin-eyebrow">Braham Licia CMS</p>
        <h1>Admin login</h1>
        <div className="admin-form">
          <p className="admin-muted">Sign in with an approved Google account.</p>
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="admin-button admin-button--primary" disabled={isSubmitting} onClick={handleGoogleSignIn} type="button">
            {isSubmitting ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </section>
    </main>
  )
}

function SettingsEditor({ setStatus }) {
  const [settings, setSettings] = useState(defaultSiteContent.siteConfig)

  useEffect(() => {
    return subscribeToSettings(
      'cmsDrafts',
      (draftSettings) => {
        setSettings({
          ...defaultSiteContent.siteConfig,
          ...(draftSettings ?? {}),
        })
      },
      (error) => setStatus(`Settings load failed: ${error.message}`),
    )
  }, [setStatus])

  async function handleSave(action) {
    setStatus('')

    try {
      if (action === 'publish') {
        await publishSettings(settings)
        setStatus('Settings published.')
      } else {
        await saveDraftSettings(settings)
        setStatus('Settings draft saved.')
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <p className="admin-eyebrow">Site settings</p>
          <h2>Company details</h2>
        </div>
        <div className="admin-actions">
          <button className="admin-button" onClick={() => handleSave('draft')} type="button">
            Save draft
          </button>
          <button className="admin-button admin-button--primary" onClick={() => handleSave('publish')} type="button">
            Publish
          </button>
        </div>
      </div>

      <div className="admin-form admin-form--grid">
        {settingsFields.map(([name, label]) => (
          <label key={name}>
            <span>{label}</span>
            <input
              onChange={(event) => setSettings((current) => ({ ...current, [name]: event.target.value }))}
              value={settings[name] ?? ''}
            />
          </label>
        ))}
      </div>
    </section>
  )
}

function ContentField({ field, item, onChange, onImageUpload, uploadState }) {
  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input
          checked={Boolean(fieldValue(item, field.name))}
          onChange={(event) => onChange(field.name, event.target.checked)}
          type="checkbox"
        />
        <span>{field.label}</span>
      </label>
    )
  }

  if (field.type === 'array') {
    return (
      <label>
        <span>{field.label}</span>
        <textarea
          onChange={(event) => {
            const items = event.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
            onChange(field.name, items)
          }}
          rows="5"
          value={(fieldValue(item, field.name) ?? []).join('\n')}
        />
        <small>Use one line per item.</small>
      </label>
    )
  }

  if (field.type === 'image') {
    const image = fieldValue(item, field.name) ?? {}

    return (
      <div className="admin-image-field">
        <label>
          <span>{field.label} URL</span>
          <input
            onChange={(event) => onChange(`${field.name}.src`, event.target.value)}
            value={image.src ?? ''}
          />
        </label>
        <label>
          <span>{field.label} alt text</span>
          <input
            onChange={(event) => onChange(`${field.name}.alt`, event.target.value)}
            value={image.alt ?? ''}
          />
        </label>
        <label>
          <span>Upload replacement</span>
          <input
            accept="image/png,image/jpeg,image/webp"
            disabled={uploadState === 'uploading'}
            onChange={(event) => onImageUpload(event.target.files?.[0], field.name)}
            type="file"
          />
        </label>
        {image.src ? (
          <figure className="admin-image-preview">
            <img alt={image.alt ?? ''} src={image.src} />
          </figure>
        ) : null}
      </div>
    )
  }

  const inputValue = fieldValue(item, field.name) ?? ''

  return (
    <label>
      <span>{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea
          onChange={(event) => onChange(field.name, event.target.value)}
          rows="4"
          value={inputValue}
        />
      ) : (
        <input
          onChange={(event) => {
            const value = field.type === 'number' ? Number(event.target.value) : event.target.value
            onChange(field.name, value)
          }}
          type={field.type ?? 'text'}
          value={inputValue}
        />
      )}
    </label>
  )
}

function SectionEditor({ sectionName, setStatus }) {
  const section = editableSections.find((item) => item.collectionName === sectionName)
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState(null)
  const [uploadState, setUploadState] = useState('idle')

  useEffect(() => {
    setDraft(null)

    return subscribeToSection(
      'cmsDrafts',
      sectionName,
      setItems,
      (error) => setStatus(`${section?.label ?? sectionName} load failed: ${error.message}`),
    )
  }, [section?.label, sectionName, setStatus])

  const fields = sectionFields[sectionName] ?? []

  function startNewItem() {
    setDraft(createEmptyItem(sectionName, items.length))
  }

  function updateDraft(name, value) {
    setDraft((current) => setFieldValue(current, name, value))
  }

  function buildWritableDraft() {
    const writable = cloneItem(draft)
    const baseTitle = itemTitle(writable, sectionName)

    writable.id = writable.id || writable.anchor || slugify(baseTitle)
    writable.order = Number.isFinite(Number(writable.order)) ? Number(writable.order) : items.length

    if (sectionName === 'services') {
      writable.anchor = writable.anchor || slugify(writable.title)
      writable.id = writable.anchor
    }

    return writable
  }

  async function handleSave(action) {
    setStatus('')

    try {
      const writable = buildWritableDraft()

      if (action === 'publish') {
        await publishDraftItem(sectionName, writable)
        setStatus(`${section.singularLabel} published.`)
      } else {
        await saveDraftItem(sectionName, writable)
        setStatus(`${section.singularLabel} draft saved.`)
      }

      setDraft(writable)
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function handleUnpublish() {
    setStatus('')

    try {
      await unpublishItem(sectionName, draft.id)
      setStatus(`${section.singularLabel} unpublished.`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function handleDelete() {
    if (!draft?.id || !window.confirm(`Delete this ${section.singularLabel.toLowerCase()}?`)) return

    setStatus('')

    try {
      await deleteContentItem(sectionName, draft.id)
      setDraft(null)
      setStatus(`${section.singularLabel} deleted.`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function handleImageUpload(file, fieldName) {
    if (!file) return

    setStatus('')
    setUploadState('uploading')

    try {
      const asset = await uploadImageToCloudinary(file, `cms/${sectionName}`)
      await saveMediaAsset({
        alt: fieldValue(draft, `${fieldName}.alt`) ?? '',
        bytes: asset.bytes,
        format: asset.format,
        height: asset.height,
        public_id: asset.publicId,
        section: sectionName,
        secure_url: asset.secureUrl,
        width: asset.width,
      })
      updateDraft(`${fieldName}.src`, asset.secureUrl)
      setStatus('Image uploaded.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setUploadState('idle')
    }
  }

  return (
    <section className="admin-panel admin-panel--split">
      <div className="admin-list">
        <div className="admin-panel__head">
          <div>
            <p className="admin-eyebrow">Draft content</p>
            <h2>{section?.label}</h2>
          </div>
          <button className="admin-button admin-button--primary" onClick={startNewItem} type="button">
            New
          </button>
        </div>

        <div className="admin-list__items">
          {items.map((item) => (
            <button
              className={`admin-list__item${draft?.id === item.id ? ' is-active' : ''}`}
              key={item.id}
              onClick={() => setDraft(cloneItem(item))}
              type="button"
            >
              <strong>{itemTitle(item, sectionName)}</strong>
              <span>{item.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-editor">
        {draft ? (
          <>
            <div className="admin-panel__head">
              <div>
                <p className="admin-eyebrow">{draft.id}</p>
                <h2>{itemTitle(draft, sectionName)}</h2>
              </div>
              <div className="admin-actions">
                <button className="admin-button" onClick={() => handleSave('draft')} type="button">
                  Save draft
                </button>
                <button className="admin-button admin-button--primary" onClick={() => handleSave('publish')} type="button">
                  Publish
                </button>
              </div>
            </div>

            <div className="admin-form admin-form--grid">
              <label>
                <span>Document ID</span>
                <input
                  disabled={sectionName === 'services'}
                  onChange={(event) => updateDraft('id', slugify(event.target.value))}
                  value={draft.id ?? ''}
                />
              </label>
              {fields.map((field) => (
                <ContentField
                  field={field}
                  item={draft}
                  key={field.name}
                  onChange={updateDraft}
                  onImageUpload={handleImageUpload}
                  uploadState={uploadState}
                />
              ))}
            </div>

            <div className="admin-danger-row">
              <button className="admin-button" onClick={handleUnpublish} type="button">
                Unpublish
              </button>
              <button className="admin-button admin-button--danger" onClick={handleDelete} type="button">
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="admin-empty">
            <h2>Select an item</h2>
            <p>Choose an existing draft or create a new item.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function EnquiriesPanel({ setStatus }) {
  const [enquiries, setEnquiries] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true)
    setStatus('')

    try {
      setEnquiries(await getEnquiries())
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [setStatus])

  useEffect(() => {
    loadEnquiries()
  }, [loadEnquiries])

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <p className="admin-eyebrow">Website enquiries</p>
          <h2>Inbox</h2>
        </div>
        <button className="admin-button" disabled={isLoading} onClick={loadEnquiries} type="button">
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="admin-enquiries">
        {enquiries.map((enquiry) => (
          <article className="admin-enquiry" key={enquiry.id}>
            <div>
              <strong>{enquiry.name}</strong>
              <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
            </div>
            <p>{enquiry.description}</p>
            <dl>
              <div>
                <dt>Organisation</dt>
                <dd>{enquiry.organisation || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{enquiry.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{enquiry.service}</dd>
              </div>
              <div>
                <dt>Next step</dt>
                <dd>{enquiry.nextStep}</dd>
              </div>
            </dl>
          </article>
        ))}
        {!enquiries.length && !isLoading ? <p className="admin-muted">No enquiries yet.</p> : null}
      </div>
    </section>
  )
}

function AdminDashboard({ user }) {
  const [activeSection, setActiveSection] = useState('settings')
  const [status, setStatus] = useState('')
  const navigation = useMemo(
    () => [
      { id: 'settings', label: 'Settings' },
      ...editableSections.map((section) => ({
        id: section.collectionName,
        label: section.label,
      })),
      { id: 'enquiries', label: 'Enquiries' },
    ],
    [],
  )

  async function handleSeed() {
    setStatus('')

    try {
      await seedContentToFirestore(defaultSiteContent)
      setStatus('Default content seeded to drafts and published content.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-eyebrow">Braham Licia CMS</p>
          <h1>Dashboard</h1>
        </div>
        <nav className="admin-nav" aria-label="CMS sections">
          {navigation.map((item) => (
            <button
              className={activeSection === item.id ? 'is-active' : ''}
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{user.email}</span>
          <button className="admin-button" onClick={handleSeed} type="button">
            Seed defaults
          </button>
          <button className="admin-button" onClick={() => signOut(auth)} type="button">
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {status ? <p className="admin-status">{status}</p> : null}
        {activeSection === 'settings' ? <SettingsEditor setStatus={setStatus} /> : null}
        {editableSections.some((section) => section.collectionName === activeSection) ? (
          <SectionEditor sectionName={activeSection} setStatus={setStatus} />
        ) : null}
        {activeSection === 'enquiries' ? <EnquiriesPanel setStatus={setStatus} /> : null}
      </div>
    </main>
  )
}

export function AdminPage() {
  const [authState, setAuthState] = useState({
    isAdmin: false,
    isChecking: Boolean(auth),
    user: null,
  })

  useEffect(() => {
    if (!auth) return undefined

    return onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthState({ isAdmin: false, isChecking: false, user: null })
        return
      }

      const hasAccess = await isAdminUser(currentUser.uid, currentUser.email)
      setAuthState({
        isAdmin: hasAccess,
        isChecking: false,
        user: currentUser,
      })
    })
  }, [])

  if (!isFirebaseConfigured) {
    return (
      <main className="admin-shell admin-shell--login">
        <section className="admin-login">
          <p className="admin-eyebrow">Configuration required</p>
          <h1>Firebase env vars are missing</h1>
          <p className="admin-muted">Add the Vite Firebase variables before using the CMS.</p>
        </section>
      </main>
    )
  }

  if (authState.isChecking) {
    return (
      <main className="admin-shell admin-shell--login">
        <section className="admin-login">
          <p className="admin-muted">Checking admin access...</p>
        </section>
      </main>
    )
  }

  if (!authState.user) return <LoginPanel />

  if (!authState.isAdmin) {
    return (
      <main className="admin-shell admin-shell--login">
        <section className="admin-login">
          <p className="admin-eyebrow">Access denied</p>
          <h1>This Google account is not allowed</h1>
          <p className="admin-muted">Use one of the approved admin Gmail accounts.</p>
          <button className="admin-button" onClick={() => signOut(auth)} type="button">
            Sign out
          </button>
        </section>
      </main>
    )
  }

  return <AdminDashboard user={authState.user} />
}
