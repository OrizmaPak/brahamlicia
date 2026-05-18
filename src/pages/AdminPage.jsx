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
import { seedPageContent, subscribeEnquiries } from '../lib/homeContentRepository.js'

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

function EnquiriesInbox() {
  const [enquiries, setEnquiries] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <section className="admin-card admin-card--wide admin-inbox-panel">
      <div className="admin-card__head">
        <div>
          <span>Inbox</span>
          <h2>Enquiries</h2>
        </div>
        <strong>{enquiries.length}</strong>
      </div>
      {isLoading ? <p>Loading enquiries...</p> : null}
      {error ? <div className="admin-alert">{error}</div> : null}
      {!isLoading && enquiries.length === 0 ? (
        <p>No enquiries yet. Contact form submissions will appear here once Firebase is configured and rules are deployed.</p>
      ) : null}
      {enquiries.length > 0 ? (
        <div className="admin-enquiry-list">
          {enquiries.map((item) => {
            const createdAt = item.createdAt?.toDate?.().toLocaleString?.() ?? 'No date yet'

            return (
              <article className="admin-enquiry" key={item.id}>
                <div>
                  <span>{createdAt}</span>
                  <h3>{item.name || 'Unnamed enquiry'}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="admin-enquiry__meta">
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                  {item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : null}
                  <span>{item.service}</span>
                  <span>{item.nextStep}</span>
                </div>
              </article>
            )
          })}
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
            <span>Page controls</span>
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

const pageLabels = {
  about: 'About',
  contact: 'Contact',
  footer: 'Footer',
  home: 'Home',
  services: 'Services',
}

function Dashboard({ onLogout, user }) {
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
          <h1>Content Control Center</h1>
          <p>Manage page editing, baseline resets, and enquiry review from one operational console.</p>
        </div>
        <div className="admin-session-card">
          <span>Authorized session</span>
          <strong>{user.email}</strong>
          <button className="button button--secondary" onClick={onLogout} type="button">
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-status-strip" aria-label="Dashboard status">
        <div>
          <span>Editable areas</span>
          <strong>5</strong>
        </div>
        <div>
          <span>Editor mode</span>
          <strong>Inline</strong>
        </div>
        <div>
          <span>Revisions</span>
          <strong>On save</strong>
        </div>
        <div>
          <span>Content source</span>
          <strong>Firestore</strong>
        </div>
      </section>

      <section className="admin-workspace">
        <div className="admin-workspace__head">
          <div>
            <span className="admin-kicker">Pages</span>
            <h2>Site editing controls</h2>
          </div>
          <p>Edit pages directly on the live interface or reset a page to its original baseline content.</p>
        </div>
        <div className="admin-action-grid">
          <PageControlPanel
            description="Edit the Home page or reset it back to the original baseline content."
            editHref="/admin/?edit=home"
            index={1}
            onReset={() => setResetTargetPage('home')}
            resetLabel="Reset Home Page"
            title="Home Page"
          />
          <PageControlPanel
            description="Update the About page copy, cards, links, and images directly."
            editHref="/admin/?edit=about"
            index={2}
            onReset={() => setResetTargetPage('about')}
            resetLabel="Reset About Page"
            title="About Page"
          />
          <PageControlPanel
            description="Update service cards, accordion details, images, and CTAs."
            editHref="/admin/?edit=services"
            index={3}
            onReset={() => setResetTargetPage('services')}
            resetLabel="Reset Services Page"
            title="Services Page"
          />
          <PageControlPanel
            description="Edit hero copy, contact details, imagery, and CTA content."
            editHref="/admin/?edit=contact"
            index={4}
            onReset={() => setResetTargetPage('contact')}
            resetLabel="Reset Contact Page"
            title="Contact Page"
          />
          <PageControlPanel
            description="Update the global footer brand copy, navigation links, contact details, and bottom notes."
            editHref="/admin/?edit=footer"
            index={5}
            onReset={() => setResetTargetPage('footer')}
            resetLabel="Reset Footer"
            title="Global Footer"
          />
        </div>
      </section>

      {seedStatus ? <div className="admin-status">{seedStatus}</div> : null}
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
      <EnquiriesInbox />
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
