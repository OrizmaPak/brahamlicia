import React, { useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { AboutPage } from './AboutPage.jsx'
import { ContactPage } from './ContactPage.jsx'
import { FooterEditorPage } from './FooterEditorPage.jsx'
import { HomePage } from './HomePage.jsx'
import { ServicesPage } from './ServicesPage.jsx'
import { createAboutFallbackFields } from '../content/aboutContentFields.js'
import { createContactFallbackFields } from '../content/contactContentFields.js'
import { createFooterFallbackFields } from '../content/footerContentFields.js'
import { createHomeFallbackFields } from '../content/homeContentFields.js'
import { createServicesFallbackFields } from '../content/servicesContentFields.js'
import { InlineEditorProvider } from '../context/InlineEditorContext.jsx'
import { allowedAdminEmails, isAllowedAdminEmail } from '../lib/adminAccess.js'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'
import {
  addEnquiryNote,
  createEnquiryStatus,
  deleteEnquiryNote,
  deleteEnquiryStatus,
  seedPageContent,
  setEnquiryArchived,
  subscribeEnquiries,
  subscribeEnquiryStatuses,
  updateEnquiryStatus,
} from '../lib/homeContentRepository.js'

function AdminFrame({ children }) {
  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div className="admin-panel__brand">
          <span>Braham Licia</span>
          <strong>Admin</strong>
        </div>
        {children}
      </section>
    </main>
  )
}

function FirebaseMissing() {
  return (
    <AdminFrame>
      <span className="admin-kicker">Configuration required</span>
      <h1>Firebase is not configured in this environment.</h1>
      <p>
        Add the Vite Firebase variables from `.env.example` in Vercel and locally, then reload `/admin/`.
      </p>
    </AdminFrame>
  )
}

function LoginPanel({ error, onLogin }) {
  return (
    <AdminFrame>
      <span className="admin-kicker">Restricted access</span>
      <h1>Sign in with Google to manage enquiries and edit site pages.</h1>
      <p>Allowed accounts: {allowedAdminEmails.join(', ')}.</p>
      {error ? <div className="admin-alert">{error}</div> : null}
      <button className="button button--primary" onClick={onLogin} type="button">
        Continue with Google
      </button>
    </AdminFrame>
  )
}

function EnquiriesInbox({ user }) {
  const [enquiries, setEnquiries] = useState([])
  const [statuses, setStatuses] = useState([])
  const [activeEnquiryTab, setActiveEnquiryTab] = useState('active')
  const [activeStatusFilter, setActiveStatusFilter] = useState('All')
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [statusInput, setStatusInput] = useState('')
  const [noteDraft, setNoteDraft] = useState('')
  const [busyEnquiryId, setBusyEnquiryId] = useState('')
  const [busyStatusId, setBusyStatusId] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeEnquiries(
      (items) => {
        setEnquiries(items)
        setIsLoading(false)
      },
      (nextError) => {
        setError(nextError.message)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeEnquiryStatuses(
      (items) => {
        setStatuses(items)
      },
      (nextError) => {
        setError(nextError.message)
      },
    )

    return unsubscribe
  }, [])

    const statusOptions = useMemo(() => {
    const custom = statuses.map((item) => item.label).filter(Boolean)
    return Array.from(new Set([...defaultEnquiryStatuses, ...custom]))
  }, [statuses])

  const customStatuses = useMemo(
    () => statuses.filter((item) => item.label && !defaultEnquiryStatuses.includes(item.label)),
    [statuses],
  )

  const visibleEnquiries = useMemo(() => {
    const isArchiveView = activeEnquiryTab === 'archived'
    const byArchive = enquiries.filter((item) => Boolean(item.archived) === isArchiveView)
    if (activeStatusFilter === 'All') return byArchive
    return byArchive.filter((item) => (item.status || 'Not attended') === activeStatusFilter)
  }, [activeEnquiryTab, activeStatusFilter, enquiries])

  useEffect(() => {
    if (!visibleEnquiries.length) {
      setSelectedEnquiryId('')
      return
    }

    const exists = visibleEnquiries.some((item) => item.id === selectedEnquiryId)
    if (!exists) {
      setSelectedEnquiryId(visibleEnquiries[0].id)
    }
  }, [selectedEnquiryId, visibleEnquiries])

  const selectedEnquiry = useMemo(
    () => visibleEnquiries.find((item) => item.id === selectedEnquiryId) ?? null,
    [selectedEnquiryId, visibleEnquiries],
  )

  async function handleCreateStatus() {
    if (!statusInput.trim()) return
    setBusyStatusId('create-status')
    setError('')
    try {
      await createEnquiryStatus(statusInput, user)
      setStatusInput('')
    } catch (createError) {
      setError(createError.message)
    } finally {
      setBusyStatusId('')
    }
  }

  async function handleDeleteStatus(statusId) {
    setBusyStatusId(statusId)
    setError('')
    try {
      await deleteEnquiryStatus(statusId)
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setBusyStatusId('')
    }
  }

  async function handleStatusChange(enquiryId, status) {
    setBusyEnquiryId(enquiryId)
    setError('')
    try {
      await updateEnquiryStatus(enquiryId, status, user)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setBusyEnquiryId('')
    }
  }

  async function handleAddNote() {
    if (!selectedEnquiry || !noteDraft.trim()) return
    setBusyEnquiryId(selectedEnquiry.id)
    setError('')
    try {
      await addEnquiryNote(selectedEnquiry.id, noteDraft, user)
      setNoteDraft('')
    } catch (noteError) {
      setError(noteError.message)
    } finally {
      setBusyEnquiryId('')
    }
  }

  async function handleDeleteNote(noteIndex) {
    if (!selectedEnquiry) return
    setBusyEnquiryId(selectedEnquiry.id)
    setError('')
    try {
      await deleteEnquiryNote(selectedEnquiry.id, noteIndex, user)
    } catch (noteError) {
      setError(noteError.message)
    } finally {
      setBusyEnquiryId('')
    }
  }

  async function handleArchiveToggle(enquiryId, archived) {
    setBusyEnquiryId(enquiryId)
    setError('')
    try {
      await setEnquiryArchived(enquiryId, archived, user)
    } catch (archiveError) {
      setError(archiveError.message)
    } finally {
      setBusyEnquiryId('')
    }
  }

  return (
    <section className="admin-card admin-card--wide admin-inbox-panel">
      <div className="admin-card__head">
        <div>
          <span>Enquiries</span>
          <h2>Pipeline</h2>
        </div>
        <strong>{visibleEnquiries.length}</strong>
      </div>

      <div className="admin-enquiries-toolbar">
        <div className="admin-tab-switch" role="tablist">
          <button className={activeEnquiryTab === 'active' ? 'is-active' : ''} onClick={() => setActiveEnquiryTab('active')} type="button">
            Active
          </button>
          <button className={activeEnquiryTab === 'archived' ? 'is-active' : ''} onClick={() => setActiveEnquiryTab('archived')} type="button">
            Archive
          </button>
        </div>
        <label className="admin-enquiry__control admin-filter-control">
          <span>Filter by status</span>
          <select onChange={(event) => setActiveStatusFilter(event.target.value)} value={activeStatusFilter}>
            <option value="All">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-status-board">
        <div className="admin-status-manager">
          <span>Manage status</span>
          <div>
            <input onChange={(event) => setStatusInput(event.target.value)} placeholder="Add status" type="text" value={statusInput} />
            <button className="button button--secondary" disabled={busyStatusId === 'create-status'} onClick={handleCreateStatus} type="button">
              {busyStatusId === 'create-status' ? 'Adding...' : 'Add'}
            </button>
          </div>
          <div className="admin-status-list">
            {defaultEnquiryStatuses.map((status) => (
              <span className="admin-status-pill admin-status-pill--locked" key={status}>
                {status}
              </span>
            ))}
            {customStatuses.map((status) => (
              <button
                className="admin-status-pill"
                disabled={busyStatusId === status.id}
                key={status.id}
                onClick={() => handleDeleteStatus(status.id)}
                type="button"
              >
                {busyStatusId === status.id ? 'Deleting...' : `${status.label} x`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? <p>Loading enquiries...</p> : null}
      {error ? <div className="admin-alert">{error}</div> : null}
      {!isLoading && visibleEnquiries.length === 0 ? <p>No enquiries in this list yet.</p> : null}

      {visibleEnquiries.length > 0 ? (
        <div className="admin-enquiry-shell">
          <aside className="admin-enquiry-list admin-enquiry-list--compact">
            {visibleEnquiries.map((item) => {
              const isActive = item.id === selectedEnquiryId
              return (
                <button
                  className={`admin-enquiry-row${isActive ? ' is-active' : ''}`}
                  key={item.id}
                  onClick={() => setSelectedEnquiryId(item.id)}
                  type="button"
                >
                  <strong>{item.name || 'Unnamed enquiry'}</strong>
                  <span>{item.service || 'No service selected'}</span>
                  <span>{item.status || 'Not attended'}</span>
                </button>
              )
            })}
          </aside>

          {selectedEnquiry ? (
            <article className="admin-enquiry-detail">
              <div className="admin-enquiry-detail__head">
                <div>
                  <h3>{selectedEnquiry.name || 'Unnamed enquiry'}</h3>
                  <p>{selectedEnquiry.createdAt?.toDate?.().toLocaleString?.() ?? 'No date yet'}</p>
                </div>
                <span className="admin-enquiry__status">{selectedEnquiry.status || 'Not attended'}</span>
              </div>

              <p className="admin-enquiry-detail__description">{selectedEnquiry.description}</p>
              <div className="admin-enquiry-detail__meta">
                <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a>
                {selectedEnquiry.phone ? <a href={`tel:${selectedEnquiry.phone}`}>{selectedEnquiry.phone}</a> : null}
                <span>{selectedEnquiry.nextStep}</span>
              </div>

              <div className="admin-enquiry-detail__controls">
                <label className="admin-enquiry__control">
                  <span>Status</span>
                  <select
                    disabled={busyEnquiryId === selectedEnquiry.id}
                    onChange={(event) => handleStatusChange(selectedEnquiry.id, event.target.value)}
                    value={selectedEnquiry.status || 'Not attended'}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button--secondary"
                  disabled={busyEnquiryId === selectedEnquiry.id}
                  onClick={() => handleArchiveToggle(selectedEnquiry.id, !selectedEnquiry.archived)}
                  type="button"
                >
                  {selectedEnquiry.archived ? 'Move to Active' : 'Move to Archive'}
                </button>
              </div>

              <div className="admin-enquiry-detail__notes">
                <h4>Notes</h4>
                {(selectedEnquiry.notes ?? []).length > 0 ? (
                  <div className="admin-enquiry__notes">
                    {(selectedEnquiry.notes ?? []).map((note, index) => (
                      <div className="admin-note-item" key={`${selectedEnquiry.id}-note-${index}`}>
                        <p>
                          <strong>{note.author || 'Admin'}:</strong> {note.text}
                        </p>
                        <button
                          className="button button--secondary"
                          disabled={busyEnquiryId === selectedEnquiry.id}
                          onClick={() => handleDeleteNote(index)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No notes yet.</p>
                )}
                <label className="admin-enquiry__control">
                  <span>Add note</span>
                  <textarea onChange={(event) => setNoteDraft(event.target.value)} rows={3} value={noteDraft} />
                </label>
                <button className="button button--secondary" disabled={busyEnquiryId === selectedEnquiry.id} onClick={handleAddNote} type="button">
                  Add note
                </button>
              </div>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function PageControlPanel({ description, editHref, index, onReset, resetLabel, title }) {
  return (
    <details className="admin-card admin-page-box" open>
      <summary className="admin-page-box__summary">
        <div className="admin-page-box__identity">
          <span className="admin-page-box__index">{String(index).padStart(2, '0')}</span>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <span className="admin-page-box__toggle" aria-hidden="true" />
      </summary>
      <div className="admin-page-box__actions">
        <a className="button button--primary admin-action-button admin-action-button--edit" href={editHref}>
          Edit
        </a>
        <button className="button button--secondary admin-action-button admin-action-button--reset" onClick={onReset} type="button">
          {resetLabel}
        </button>
      </div>
    </details>
  )
}

const editablePageIds = ['home', 'about', 'services', 'contact', 'footer']
const defaultEnquiryStatuses = ['Not attended', 'Attended']

const pageLabels = {
  about: 'About',
  contact: 'Contact',
  footer: 'Footer',
  home: 'Home',
  services: 'Services',
}

function Dashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('edit')
  const [seedStatus, setSeedStatus] = useState('')
  const [isSeeding, setIsSeeding] = useState(false)
  const [resetTargetPage, setResetTargetPage] = useState(null)
  const homeFallbackFields = useMemo(() => createHomeFallbackFields(), [])
  const aboutFallbackFields = useMemo(() => createAboutFallbackFields(), [])
  const servicesFallbackFields = useMemo(() => createServicesFallbackFields(), [])
  const contactFallbackFields = useMemo(() => createContactFallbackFields(), [])
  const footerFallbackFields = useMemo(() => createFooterFallbackFields(), [])

  async function handleResetPage() {
    if (!resetTargetPage) return

    setIsSeeding(true)
    const pageLabel = pageLabels[resetTargetPage] ?? 'Home'
    setSeedStatus(`Resetting all ${pageLabel} content to the original values...`)

    try {
      const fallbackFieldsByPage = {
        about: aboutFallbackFields,
        contact: contactFallbackFields,
        footer: footerFallbackFields,
        home: homeFallbackFields,
        services: servicesFallbackFields,
      }
      const fields = fallbackFieldsByPage[resetTargetPage] ?? homeFallbackFields
      await seedPageContent(resetTargetPage, fields, user)
      setSeedStatus(`${pageLabel} fallback content has been written to Firestore.`)
    } catch (error) {
      setSeedStatus(error.message)
    } finally {
      setIsSeeding(false)
      setResetTargetPage(null)
    }
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div className="admin-console-copy">
          <span className="admin-kicker">Dashboard</span>
          <h1>Content Manager</h1>
          <p>Edit pages, reset fallback content, and review enquiries.</p>
        </div>
        <div className="admin-session-card">
          <span>Authorized session</span>
          <strong>{user.email}</strong>
          <button className="button button--secondary" onClick={onLogout} type="button">
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-main-tabs">
        <button
          className={activeTab === 'edit' ? 'is-active' : ''}
          onClick={() => setActiveTab('edit')}
          type="button"
        >
          Edit page
        </button>
        <button
          className={activeTab === 'enquiries' ? 'is-active' : ''}
          onClick={() => setActiveTab('enquiries')}
          type="button"
        >
          View enquiries
        </button>
      </section>

      {activeTab === 'edit' ? (
        <section className="admin-workspace">
          <div className="admin-workspace__head">
            <div>
              <span className="admin-kicker">Pages</span>
              <h2>Choose what to edit</h2>
            </div>
            <p>Open inline editor or reset a page to baseline.</p>
          </div>
          <div className="admin-action-grid">
            <PageControlPanel
              description="Hero, sections, links, images."
              editHref="/admin/?edit=home"
              index={1}
              onReset={() => setResetTargetPage('home')}
              resetLabel="Reset Home Page"
              title="Home Page"
            />
            <PageControlPanel
              description="Story, values, audience, insights."
              editHref="/admin/?edit=about"
              index={2}
              onReset={() => setResetTargetPage('about')}
              resetLabel="Reset About Page"
              title="About Page"
            />
            <PageControlPanel
              description="Cards, details, process, calls to action."
              editHref="/admin/?edit=services"
              index={3}
              onReset={() => setResetTargetPage('services')}
              resetLabel="Reset Services Page"
              title="Services Page"
            />
            <PageControlPanel
              description="Hero, contact details, sidebar, CTA."
              editHref="/admin/?edit=contact"
              index={4}
              onReset={() => setResetTargetPage('contact')}
              resetLabel="Reset Contact Page"
              title="Contact Page"
            />
            <PageControlPanel
              description="Brand, quick links, contact, footer notes."
              editHref="/admin/?edit=footer"
              index={5}
              onReset={() => setResetTargetPage('footer')}
              resetLabel="Reset Footer"
              title="Global Footer"
            />
          </div>
        </section>
      ) : (
        <EnquiriesInbox user={user} />
      )}

      {activeTab === 'edit' && seedStatus ? <div className="admin-status">{seedStatus}</div> : null}
      {resetTargetPage ? (
        <div aria-modal="true" className="editor-modal" role="dialog">
          <div className="editor-modal__panel admin-seed-modal">
            <span className="editor-modal__eyebrow">
              Reset {pageLabels[resetTargetPage] ?? 'Home'} Content
            </span>
            <h2>
              Reset all {pageLabels[resetTargetPage] ?? 'Home'} data to the original content?
            </h2>
            <p>
              This will overwrite the current {pageLabels[resetTargetPage] ?? 'Home'}
              values in `sitePages/{resetTargetPage}` with the baseline hardcoded content.
            </p>
            {isSeeding ? (
              <div className="admin-seed-modal__loading">
                <span aria-hidden="true" className="admin-spinner" />
                <p>Resetting all data now...</p>
              </div>
            ) : null}
            <div className="editor-modal__actions">
              <button
                className="button button--secondary"
                disabled={isSeeding}
                onClick={() => setResetTargetPage(null)}
                type="button"
              >
                Cancel
              </button>
              <button className="button button--primary" disabled={isSeeding} onClick={handleResetPage} type="button">
                {isSeeding ? 'Resetting...' : 'Proceed and Reset'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export function AdminPage() {
  const [authUser, setAuthUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(() => Boolean(auth))
  const editPageId = new URLSearchParams(window.location.search).get('edit')
  const isEditMode = editablePageIds.includes(editPageId)

  useEffect(() => {
    if (!auth) {
      return () => {}
    }

    return onAuthStateChanged(auth, async (user) => {
      if (user && !isAllowedAdminEmail(user.email)) {
        setError(`${user.email} is not allowed to access this dashboard.`)
        await signOut(auth)
        setAuthUser(null)
        setIsLoading(false)
        return
      }

      setAuthUser(user)
      setIsLoading(false)
    })
  }, [])

  async function handleLogin() {
    if (!auth) return

    setError('')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const result = await signInWithPopup(auth, provider)
      if (!isAllowedAdminEmail(result.user.email)) {
        await signOut(auth)
        setError(`${result.user.email} is not allowed to access this dashboard.`)
      }
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  async function handleLogout() {
    if (auth) await signOut(auth)
  }

  if (!isFirebaseConfigured) return <FirebaseMissing />

  if (isLoading) {
    return (
      <AdminFrame>
        <span className="admin-kicker">Loading</span>
        <h1>Checking admin session...</h1>
      </AdminFrame>
    )
  }

  if (!authUser) return <LoginPanel error={error} onLogin={handleLogin} />

  if (isEditMode) {
    return (
      <InlineEditorProvider onExit={() => window.location.assign('/admin/')} pageId={editPageId} user={authUser}>
        {editPageId === 'about' ? (
          <AboutPage pageId="about" />
        ) : editPageId === 'services' ? (
          <ServicesPage pageId="services" />
        ) : editPageId === 'contact' ? (
          <ContactPage pageId="contact" />
        ) : editPageId === 'footer' ? (
          <FooterEditorPage />
        ) : (
          <HomePage pageId="home" />
        )}
      </InlineEditorProvider>
    )
  }

  return <Dashboard onLogout={handleLogout} user={authUser} />
}

