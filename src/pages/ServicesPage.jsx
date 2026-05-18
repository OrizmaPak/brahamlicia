import React from 'react'
import { SkeletonGrid } from '../components/ContentSkeleton.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { ServiceAccordion } from '../components/ServiceAccordion.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { useSiteContent } from '../context/useSiteContent.js'

export function ServicesPage({ pageId }) {
  const { contentMeta, imageLibrary, processSteps, serviceOfferings } = useSiteContent()
  const isContentLoading = contentMeta.isLoading

  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--services section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <p className="section-eyebrow">Our services</p>
            <h1 className="page-hero__title">
              Focused consulting, professional development, and advisory support for growth,
              learning, and stronger delivery.
            </h1>
            <p className="page-hero__text">
              Service details live directly inside this page so visitors can move from overview
              to deeper information without losing context.
            </p>
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <img alt={imageLibrary.advisory.alt} src={imageLibrary.advisory.src} />
          </figure>
        </div>
      </section>

      <section className="section section--mesh section--services-overview">
        <div className="container">
          <SectionHeading
            eyebrow="Service overview"
            title="Support designed around real needs and practical outcomes."
            description="Braham Licia Consulting offers services across consulting, training, and advisory support, with each service tailored to real needs and stronger execution."
          />
          {isContentLoading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div className="card-grid card-grid--services">
              {serviceOfferings.map((service, index) => (
              <article
                className="service-card service-card--compact"
                data-reveal
                key={service.anchor}
                style={{ '--delay': `${index * 90}ms` }}
              >
                <figure className="service-card__media">
                  <img alt={service.image.alt} loading="lazy" src={service.image.src} />
                </figure>
                <span className="service-card__pill">{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <a className="text-link" href={`#${service.anchor}`}>
                  Open details
                </a>
              </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--soft section--spotlight section--services-showcase-section">
        <div className="container services-showcase">
          <div data-reveal>
            <SectionHeading
              eyebrow="Visual overview"
              title="A more tangible sense of how the work shows up."
              description="Consulting, learning, and advisory work often feels abstract on a website. These visual cues make the service experience feel more grounded and real."
            />
            <div className="illustration-card illustration-card--dark">
              <div className="illustration-card__header">
                <span>Delivery model</span>
                <strong>Strategy on the table. Action in the room. Structure in the system.</strong>
              </div>
              <div className="illustration-card__grid">
                <span className="illustration-card__node" />
                <span className="illustration-card__node" />
                <span className="illustration-card__node" />
                <span className="illustration-card__line" />
              </div>
            </div>
            <div className="services-showcase__social-strip">
              <span>Founders</span>
              <span>Teams</span>
              <span>Institutions</span>
            </div>
          </div>

          <div className="services-showcase__visuals" data-reveal style={{ '--delay': '140ms' }}>
            <figure className="services-showcase__primary">
              <img alt={imageLibrary.collaboration.alt} loading="lazy" src={imageLibrary.collaboration.src} />
            </figure>
            <figure className="services-showcase__secondary services-showcase__secondary--top">
              <img alt={imageLibrary.boardroom.alt} loading="lazy" src={imageLibrary.boardroom.src} />
            </figure>
            <figure className="services-showcase__secondary services-showcase__secondary--bottom">
              <img alt={imageLibrary.workspace.alt} loading="lazy" src={imageLibrary.workspace.src} />
            </figure>
            <div className="services-showcase__flow-card">
              <span>Social alignment</span>
              <strong>People, teams, and institutions moving in one practical delivery rhythm.</strong>
              <div className="services-showcase__flow-track">
                <span>Connect</span>
                <span>Coordinate</span>
                <span>Execute</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft section--aurora section--services-details">
        <div className="container">
          <SectionHeading
            eyebrow="Service details"
            title="Detailed pathways inside a single guided services experience."
            description="Each dropdown below expands to show scope, focus areas, expected outcomes, and the next best call to action."
          />
          {isContentLoading ? <SkeletonGrid count={3} /> : <ServiceAccordion services={serviceOfferings} />}
        </div>
      </section>

      <section className="section section--halo section--services-process">
        <div className="container">
          <SectionHeading
            eyebrow="How engagements work"
            title="A structured delivery rhythm that stays flexible to your context."
          />
          {isContentLoading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="timeline-grid">
              {processSteps.map((step, index) => (
              <article
                className="timeline-card"
                data-reveal
                key={step.number}
                style={{ '--delay': `${index * 80}ms` }}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--ribbon-soft section--services-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <p className="section-eyebrow">Need support that matches your goals?</p>
            <h2 className="section-title">
              We can help you identify the right service path based on your needs, current
              stage, and desired outcomes.
            </h2>
          </div>
          <div className="button-row">
            <a className="button button--primary" href="/contact/#enquiry">
              Book a Consultation
            </a>
            <a className="button button--secondary" href="/contact/">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
