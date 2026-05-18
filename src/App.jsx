import React, { lazy, Suspense } from 'react'
import { AboutPage } from './pages/AboutPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { FaqPage } from './pages/FaqPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ServicesPage } from './pages/ServicesPage.jsx'
import { ContentProvider } from './context/ContentContext.jsx'

const AdminPage = lazy(() => import('./pages/AdminPage.jsx').then((module) => ({
  default: module.AdminPage,
})))

const pageRegistry = {
  admin: AdminPage,
  about: AboutPage,
  contact: ContactPage,
  faq: FaqPage,
  home: HomePage,
  services: ServicesPage,
}

export function App({ pageId }) {
  const Page = pageRegistry[pageId] ?? HomePage

  if (pageId === 'admin') {
    return (
      <ContentProvider>
        <Suspense fallback={<main className="admin-shell admin-shell--login">Loading CMS...</main>}>
          <AdminPage pageId={pageId} />
        </Suspense>
      </ContentProvider>
    )
  }

  return (
    <ContentProvider>
      <Page pageId={pageId} />
    </ContentProvider>
  )
}

export default App
