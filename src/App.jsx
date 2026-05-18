import React, { Suspense, lazy } from 'react'
import { AboutPage } from './pages/AboutPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { FaqPage } from './pages/FaqPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ServicesPage } from './pages/ServicesPage.jsx'

const AdminPage = lazy(() => import('./pages/AdminPage.jsx').then((module) => ({ default: module.AdminPage })))

const pageRegistry = {
  about: AboutPage,
  contact: ContactPage,
  faq: FaqPage,
  home: HomePage,
  services: ServicesPage,
}

export function App({ pageId }) {
  if (pageId === 'admin') {
    return (
      <Suspense fallback={<main className="admin-shell">Loading admin...</main>}>
        <AdminPage />
      </Suspense>
    )
  }

  const Page = pageRegistry[pageId] ?? HomePage
  return <Page pageId={pageId} />
}

export default App
