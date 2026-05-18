import React from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { EditableImage } from '../components/editor/EditableImage.jsx'
import { EditableLink } from '../components/editor/EditableLink.jsx'
import { EditableText } from '../components/editor/EditableText.jsx'
import { createServicesFallbackFields } from '../content/servicesContentFields.js'
import { processSteps, serviceOfferings } from '../content/siteContent.js'
import { PageContentProvider } from '../context/PageContentContext.jsx'

function ServicesHeading({ eyebrowKey, titleKey, descriptionKey }) {
  return (
    <SectionHeading
      eyebrow={<EditableText fieldKey={eyebrowKey} label={eyebrowKey} />}
      title={<EditableText fieldKey={titleKey} label={titleKey} />}
      description={descriptionKey ? <EditableText fieldKey={descriptionKey} label={descriptionKey} multiline /> : null}
    />
  )
}

function ServicesContent({ pageId }) {
  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--services section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <EditableText as="p" className="section-eyebrow" fieldKey="hero.eyebrow" label="Services hero eyebrow" />
            <EditableText as="h1" className="page-hero__title" fieldKey="hero.title" label="Services hero title" multiline />
            <EditableText as="p" className="page-hero__text" fieldKey="hero.description" label="Services hero description" multiline />
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <EditableImage fieldKey="hero.image" label="Services hero image" />
          </figure>
        </div>
      </section>

      <section className="section section--mesh section--services-overview">
        <div className="container">
          <ServicesHeading
            eyebrowKey="overview.heading.eyebrow"
            titleKey="overview.heading.title"
            descriptionKey="overview.heading.description"
          />
          <div className="card-grid card-grid--services">
            {serviceOfferings.map((service, index) => (
              <article
                className="service-card service-card--compact"
                data-reveal
                key={service.anchor}
                style={{ '--delay': `${index * 90}ms` }}
              >
                <figure className="service-card__media">
                  <EditableImage fieldKey={`overview.cards.${index}.image`} label={`Service overview ${index + 1} image`} loading="lazy" />
                </figure>
                <EditableText as="span" className="service-card__pill" fieldKey={`overview.cards.${index}.category`} label={`Service overview ${index + 1} category`} />
                <EditableText as="h3" fieldKey={`overview.cards.${index}.title`} label={`Service overview ${index + 1} title`} multiline />
                <EditableText as="p" fieldKey={`overview.cards.${index}.summary`} label={`Service overview ${index + 1} summary`} multiline />
                <EditableLink className="text-link" fieldKey={`overview.cards.${index}.link`} label={`Service overview ${index + 1} link`} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--spotlight section--services-showcase-section">
        <div className="container services-showcase">
          <div data-reveal>
            <ServicesHeading
              eyebrowKey="visual.heading.eyebrow"
              titleKey="visual.heading.title"
              descriptionKey="visual.heading.description"
            />
            <div className="illustration-card illustration-card--dark">
              <div className="illustration-card__header">
                <EditableText as="span" fieldKey="visual.delivery.label" label="Visual delivery label" />
                <EditableText as="strong" fieldKey="visual.delivery.title" label="Visual delivery title" multiline />
              </div>
              <div className="illustration-card__grid">
                <span className="illustration-card__node" />
                <span className="illustration-card__node" />
                <span className="illustration-card__node" />
                <span className="illustration-card__line" />
              </div>
            </div>
            <div className="services-showcase__social-strip">
              <EditableText as="span" fieldKey="visual.audiences.0" label="Visual audience 1" />
              <EditableText as="span" fieldKey="visual.audiences.1" label="Visual audience 2" />
              <EditableText as="span" fieldKey="visual.audiences.2" label="Visual audience 3" />
            </div>
          </div>

          <div className="services-showcase__visuals" data-reveal style={{ '--delay': '140ms' }}>
            <figure className="services-showcase__primary">
              <EditableImage fieldKey="visual.images.primary" label="Visual primary image" loading="lazy" />
            </figure>
            <figure className="services-showcase__secondary services-showcase__secondary--top">
              <EditableImage fieldKey="visual.images.secondaryTop" label="Visual top image" loading="lazy" />
            </figure>
            <figure className="services-showcase__secondary services-showcase__secondary--bottom">
              <EditableImage fieldKey="visual.images.secondaryBottom" label="Visual bottom image" loading="lazy" />
            </figure>
            <div className="services-showcase__flow-card">
              <EditableText as="span" fieldKey="visual.flow.label" label="Visual flow label" />
              <EditableText as="strong" fieldKey="visual.flow.title" label="Visual flow title" multiline />
              <div className="services-showcase__flow-track">
                <EditableText as="span" fieldKey="visual.flow.track.0" label="Visual flow 1" />
                <EditableText as="span" fieldKey="visual.flow.track.1" label="Visual flow 2" />
                <EditableText as="span" fieldKey="visual.flow.track.2" label="Visual flow 3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft section--aurora section--services-details">
        <div className="container">
          <ServicesHeading
            eyebrowKey="details.heading.eyebrow"
            titleKey="details.heading.title"
            descriptionKey="details.heading.description"
          />

          <div className="service-accordion">
            {serviceOfferings.map((service, index) => (
              <details
                className="service-detail"
                id={service.anchor}
                key={service.anchor}
                open={index === 0}
                data-reveal
                style={{ '--delay': `${index * 90}ms` }}
              >
                <summary className="service-detail__summary">
                  <div>
                    <EditableText as="span" className="service-detail__pill" fieldKey={`details.cards.${index}.category`} label={`Service detail ${index + 1} category`} />
                    <EditableText as="h3" fieldKey={`details.cards.${index}.title`} label={`Service detail ${index + 1} title`} multiline />
                    <EditableText as="p" fieldKey={`details.cards.${index}.summary`} label={`Service detail ${index + 1} summary`} multiline />
                  </div>
                  <span aria-hidden="true" className="service-detail__toggle" />
                </summary>
                <div className="service-detail__body">
                  <div className="service-detail__grid">
                    <figure className="service-detail__media">
                      <EditableImage fieldKey={`details.cards.${index}.image`} label={`Service detail ${index + 1} image`} loading="lazy" />
                    </figure>
                    <div className="service-detail__content">
                      <div>
                        <EditableText as="p" className="service-detail__label" fieldKey="details.labels.overview" label="Details overview label" />
                        <EditableText as="p" fieldKey={`details.cards.${index}.intro`} label={`Service detail ${index + 1} intro`} multiline />
                      </div>
                      <div>
                        <EditableText as="p" className="service-detail__label" fieldKey="details.labels.includes" label="Details includes label" />
                        <ul className="detail-list">
                          {service.points.map((point, pointIndex) => (
                            <li key={point}>
                              <EditableText fieldKey={`details.cards.${index}.points.${pointIndex}`} label={`Service detail ${index + 1} point ${pointIndex + 1}`} multiline />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <EditableText as="p" className="service-detail__label" fieldKey="details.labels.gain" label="Details gain label" />
                        <EditableText as="p" fieldKey={`details.cards.${index}.outcomes`} label={`Service detail ${index + 1} outcomes`} multiline />
                      </div>
                      <EditableLink className="text-link" fieldKey={`details.cards.${index}.cta`} label={`Service detail ${index + 1} CTA`} />
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--halo section--services-process">
        <div className="container">
          <SectionHeading
            eyebrow={<EditableText fieldKey="process.heading.eyebrow" label="Services process eyebrow" />}
            title={<EditableText fieldKey="process.heading.title" label="Services process title" />}
          />
          <div className="timeline-grid">
            {processSteps.map((step, index) => (
              <article
                className="timeline-card"
                data-reveal
                key={step.number}
                style={{ '--delay': `${index * 80}ms` }}
              >
                <EditableText as="span" fieldKey={`process.steps.${index}.number`} label={`Process step ${index + 1} number`} />
                <EditableText as="h3" fieldKey={`process.steps.${index}.title`} label={`Process step ${index + 1} title`} />
                <EditableText as="p" fieldKey={`process.steps.${index}.description`} label={`Process step ${index + 1} description`} multiline />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--services-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <EditableText as="p" className="section-eyebrow" fieldKey="cta.eyebrow" label="Services CTA eyebrow" />
            <EditableText as="h2" className="section-title" fieldKey="cta.title" label="Services CTA title" multiline />
          </div>
          <div className="button-row">
            <EditableLink className="button button--primary" fieldKey="cta.primary" label="Services CTA primary" />
            <EditableLink className="button button--secondary" fieldKey="cta.secondary" label="Services CTA secondary" />
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

export function ServicesPage({ pageId }) {
  return (
    <PageContentProvider createFallbackFields={createServicesFallbackFields} pageId="services">
      <ServicesContent pageId={pageId} />
    </PageContentProvider>
  )
}
