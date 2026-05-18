import React, { useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { HomePage } from './HomePage.jsx'
import { createHomeFallbackFields } from '../content/homeContentFields.js'
import { InlineEditorProvider } from '../context/InlineEditorContext.jsx'
import { allowedAdminEmails, isAllowedAdminEmail } from '../lib/adminAccess.js'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'
import { seedHomeContent, subscribeEnquiries } from '../lib/homeContentRepository.js'

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
      <h1>Sign in with Google to manage enquiries and edit the Home page.</h1>
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
    <section className="admin-card admin-card--wide">
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

function Dashboard({ onLogout, user }) {
  const [seedStatus, setSeedStatus] = useState('')
  const fallbackFields = useMemo(() => createHomeFallbackFields(), [])

  async function handleSeedHome() {
    setSeedStatus('Seeding Home content...')

    try {
      await seedHomeContent(fallbackFields, user)
      setSeedStatus('Home fallback content has been written to Firestore.')
    } catch (error) {
      setSeedStatus(error.message)
    }
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <span className="admin-kicker">Dashboard</span>
          <h1>Manage enquiries and launch Home page editing.</h1>
          <p>{user.email}</p>
        </div>
        <button className="button button--secondary" onClick={onLogout} type="button">
          Sign out
        </button>
      </header>

      <div className="admin-action-grid">
        <a className="admin-card admin-card--action" href="/admin/?edit=home">
          <span>Inline CMS</span>
          <h2>Edit Home Page</h2>
          <p>Open the real Home page, click any outlined text, link, or image, then save live with a revision backup.</p>
        </a>
        <button className="admin-card admin-card--action admin-card--button" onClick={handleSeedHome} type="button">
          <span>Initial content</span>
          <h2>Seed Home Fallback</h2>
          <p>Copy the current hardcoded Home content into `sitePages/home` so every field is ready for inline editing.</p>
        </button>
      </div>

      {seedStatus ? <div className="admin-status">{seedStatus}</div> : null}
      <EnquiriesInbox />
    </main>
  )
}

export function AdminPage() {
  const [authUser, setAuthUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(() => Boolean(auth))
  const isEditHome = new URLSearchParams(window.location.search).get('edit') === 'home'

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

  if (isEditHome) {
    return (
      <InlineEditorProvider onExit={() => window.location.assign('/admin/')} user={authUser}>
        <HomePage pageId="home" />
      </InlineEditorProvider>
    )
  }

  return <Dashboard onLogout={handleLogout} user={authUser} />
}
