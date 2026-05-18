import React from 'react'
import { SiteFooter } from '../components/SiteLayout.jsx'

export function FooterEditorPage() {
  return (
    <div className="site-shell site-shell--footer-editor">
      <main>
        <section className="section section--soft footer-editor-preview">
          <div className="container footer-editor-preview__panel" data-reveal>
            <p className="section-eyebrow">Global footer editor</p>
            <h1 className="page-hero__title">Edit the footer once, then it updates across the whole website.</h1>
            <p className="page-hero__text">
              Use the outlined footer text and links below to update brand copy, navigation links, contact details,
              and bottom notes.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
