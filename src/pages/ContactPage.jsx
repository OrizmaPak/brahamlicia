import React from 'react'
import { ContactForm } from '../components/ContactForm.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { EditableImage } from '../components/editor/EditableImage.jsx'
import { EditableLink } from '../components/editor/EditableLink.jsx'
import { EditableText } from '../components/editor/EditableText.jsx'
import { createContactFallbackFields } from '../content/contactContentFields.js'
import { PageContentProvider } from '../context/PageContentContext.jsx'

function ContactContent({ pageId }) {
  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--contact section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <EditableText as="p" className="section-eyebrow" fieldKey="hero.eyebrow" label="Contact hero eyebrow" />
            <EditableText as="h1" className="page-hero__title" fieldKey="hero.title" label="Contact hero title" multiline />
            <EditableText as="p" className="page-hero__text" fieldKey="hero.description" label="Contact hero description" multiline />
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <EditableImage fieldKey="hero.image" label="Contact hero image" />
          </figure>
        </div>
      </section>

      <section className="section section--mesh section--contact-main">
        <div className="container contact-grid">
          <div className="contact-grid__form">
            <SectionHeading
              eyebrow={<EditableText fieldKey="form.heading.eyebrow" label="Contact form eyebrow" />}
              title={<EditableText fieldKey="form.heading.title" label="Contact form title" />}
              description={<EditableText fieldKey="form.heading.description" label="Contact form description" multiline />}
            />
            <div className="contact-grid__intro-visual" data-reveal style={{ '--delay': '80ms' }}>
              <figure className="contact-grid__feature-image">
                <EditableImage fieldKey="form.visual.image" label="Contact form intro image" loading="lazy" />
              </figure>
              <div className="illustration-card illustration-card--compact">
                <div className="illustration-card__header">
                  <EditableText as="span" fieldKey="form.visual.label" label="Contact form visual label" />
                  <EditableText as="strong" fieldKey="form.visual.title" label="Contact form visual title" multiline />
                </div>
              </div>
            </div>
            <ContactForm />
          </div>

          <aside className="contact-sidebar" data-reveal style={{ '--delay': '120ms' }}>
            <div className="contact-card">
              <EditableText as="h3" fieldKey="details.heading" label="Contact details heading" />
              <div className="contact-list">
                <div>
                  <EditableText as="span" fieldKey="details.labels.email" label="Contact label email" />
                  <EditableLink fieldKey="details.values.email" label="Contact value email" />
                </div>
                <div>
                  <EditableText as="span" fieldKey="details.labels.support" label="Contact label support" />
                  <EditableLink fieldKey="details.values.support" label="Contact value support" />
                </div>
                <div>
                  <EditableText as="span" fieldKey="details.labels.phone" label="Contact label phone" />
                  <EditableLink fieldKey="details.values.phone" label="Contact value phone" />
                </div>
                <div>
                  <EditableText as="span" fieldKey="details.labels.altPhone" label="Contact label alt phone" />
                  <EditableLink fieldKey="details.values.altPhone" label="Contact value alt phone" />
                </div>
                <div>
                  <EditableText as="span" fieldKey="details.labels.location" label="Contact label location" />
                  <EditableText as="p" fieldKey="details.values.location" label="Contact value location" multiline />
                </div>
                <div>
                  <EditableText as="span" fieldKey="details.labels.hours" label="Contact label business hours" />
                  <EditableText as="p" fieldKey="details.values.hours" label="Contact value business hours" multiline />
                </div>
              </div>
            </div>
            <div className="contact-sidebar__stack">
              <figure className="contact-sidebar__image">
                <EditableImage fieldKey="details.images.primary" label="Contact sidebar primary image" loading="lazy" />
              </figure>
              <figure className="contact-sidebar__image contact-sidebar__image--compact">
                <EditableImage fieldKey="details.images.secondary" label="Contact sidebar secondary image" loading="lazy" />
              </figure>
              <div className="illustration-card illustration-card--compact">
                <div className="illustration-card__header">
                  <EditableText as="span" fieldKey="details.next.label" label="Contact next-step label" />
                  <EditableText as="strong" fieldKey="details.next.title" label="Contact next-step title" multiline />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--ribbon-soft section--contact-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <EditableText as="p" className="section-eyebrow" fieldKey="cta.eyebrow" label="Contact CTA eyebrow" />
            <EditableText as="h2" className="section-title" fieldKey="cta.title" label="Contact CTA title" multiline />
          </div>
          <div className="button-row">
            <EditableLink className="button button--primary" fieldKey="cta.primary" label="Contact CTA primary" />
            <EditableLink className="button button--secondary" fieldKey="cta.secondary" label="Contact CTA secondary" />
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

export function ContactPage({ pageId }) {
  return (
    <PageContentProvider createFallbackFields={createContactFallbackFields} pageId="contact">
      <ContactContent pageId={pageId} />
    </PageContentProvider>
  )
}
