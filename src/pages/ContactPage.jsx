import React from 'react'
import { ContactForm } from '../components/ContactForm.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { imageLibrary, siteConfig } from '../content/siteContent.js'

export function ContactPage({ pageId }) {
  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--contact section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <p className="section-eyebrow">Contact us</p>
            <h1 className="page-hero__title">
              Let's talk about how Braham Licia Consulting can support your growth, learning,
              or next initiative.
            </h1>
            <p className="page-hero__text">
              Whether you need consulting support, a training engagement, project advisory, or
              simply want to explore possibilities, we would be glad to hear from you.
            </p>
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <img alt={imageLibrary.office.alt} src={imageLibrary.office.src} />
          </figure>
        </div>
      </section>

      <section className="section section--mesh section--contact-main">
        <div className="container contact-grid">
          <div className="contact-grid__form">
            <SectionHeading
              eyebrow="Send an enquiry"
              title="Tell us a little about your needs."
              description="Use the form below to share your goals, service interest, and preferred next step."
            />
            <div className="contact-grid__intro-visual" data-reveal style={{ '--delay': '80ms' }}>
              <figure className="contact-grid__feature-image">
                <img alt={imageLibrary.collaboration.alt} loading="lazy" src={imageLibrary.collaboration.src} />
              </figure>
              <div className="illustration-card illustration-card--compact">
                <div className="illustration-card__header">
                  <span>First contact</span>
                  <strong>Clear brief. Calm review. Structured next move.</strong>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>

          <aside className="contact-sidebar" data-reveal style={{ '--delay': '120ms' }}>
            <div className="contact-card">
              <h3>Contact details</h3>
              <div className="contact-list">
                <div>
                  <span>Email</span>
                  <a href={`mailto:${siteConfig.primaryEmail}`}>{siteConfig.primaryEmail}</a>
                </div>
                <div>
                  <span>Support</span>
                  <a href={`mailto:${siteConfig.secondaryEmail}`}>{siteConfig.secondaryEmail}</a>
                </div>
                <div>
                  <span>Phone</span>
                  <a href="tel:+2348143701179">{siteConfig.primaryPhone}</a>
                </div>
                <div>
                  <span>Alternate line</span>
                  <a href="tel:+2348143866334">{siteConfig.secondaryPhone}</a>
                </div>
                <div>
                  <span>Location</span>
                  <p>{siteConfig.location}</p>
                </div>
                <div>
                  <span>Business hours</span>
                  <p>{siteConfig.hours}</p>
                </div>
              </div>
            </div>
            <div className="contact-sidebar__stack">
              <figure className="contact-sidebar__image">
                <img alt={imageLibrary.training.alt} loading="lazy" src={imageLibrary.training.src} />
              </figure>
              <figure className="contact-sidebar__image contact-sidebar__image--compact">
                <img alt={imageLibrary.boardroom.alt} loading="lazy" src={imageLibrary.boardroom.src} />
              </figure>
              <div className="illustration-card illustration-card--compact">
                <div className="illustration-card__header">
                  <span>Next step</span>
                  <strong>Tell us the brief. We shape the path.</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--ribbon-soft section--contact-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <p className="section-eyebrow">Ready to take the next step?</p>
            <h2 className="section-title">
              Book a consultation or send an enquiry and let's explore how we can work together.
            </h2>
          </div>
          <div className="button-row">
            <a className="button button--primary" href="/contact/#enquiry">
              Book a Consultation
            </a>
            <a className="button button--secondary" href={`mailto:${siteConfig.primaryEmail}`}>
              Email Us
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
