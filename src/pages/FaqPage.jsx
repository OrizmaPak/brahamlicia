import React from 'react'
import { SkeletonGrid } from '../components/ContentSkeleton.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { useSiteContent } from '../context/useSiteContent.js'

export function FaqPage({ pageId }) {
  const { contentMeta, faqItems, imageLibrary } = useSiteContent()
  const isContentLoading = contentMeta.isLoading

  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <p className="section-eyebrow">Frequently asked questions</p>
            <h1 className="page-hero__title">Answers to common questions about working together.</h1>
            <p className="page-hero__text">
              These quick answers cover client fit, customisation, delivery format, and how to
              choose the most suitable service path.
            </p>
          </div>
          <div className="faq-hero-stack" data-reveal style={{ '--delay': '140ms' }}>
            <figure className="faq-hero-stack__primary">
              <img alt={imageLibrary.leadership.alt} src={imageLibrary.leadership.src} />
            </figure>
            <div className="illustration-card illustration-card--dark">
              <div className="illustration-card__header">
                <span>Engagement logic</span>
                <strong>Questions first. Precision next. Scope only when the fit is clear.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--aurora section--faq-main">
        <div className="container faq-layout">
          <div className="faq-panel">
            <SectionHeading
              eyebrow="Quick clarity"
              title="Clear answers without the corporate fog."
              description="The FAQ now reads more like part of the brand experience, with supporting visuals and a stronger sense of professionalism."
            />
            <div className="faq-stack">
              {isContentLoading ? <SkeletonGrid count={5} variant="faq" /> : faqItems.map((item, index) => (
                <details
                  className="faq-item"
                  data-reveal
                  key={item.question}
                  open={index === 0}
                  style={{ '--delay': `${index * 70}ms` }}
                >
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="faq-aside" data-reveal style={{ '--delay': '120ms' }}>
            <figure className="faq-aside__primary">
              <img alt={imageLibrary.insightDesk.alt} loading="lazy" src={imageLibrary.insightDesk.src} />
            </figure>
            <figure className="faq-aside__secondary">
              <img alt={imageLibrary.training.alt} loading="lazy" src={imageLibrary.training.src} />
            </figure>
            <div className="illustration-card illustration-card--compact">
              <div className="illustration-card__header">
                <span>Typical outcome</span>
                <strong>Visitors get enough confidence to move from browsing into enquiry.</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--halo section--faq-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <p className="section-eyebrow">Still have questions?</p>
            <h2 className="section-title">
              You do not need to map the whole engagement before reaching out.
            </h2>
            <p className="section-description">
              An initial conversation can help clarify your needs, the right service path, and
              the most sensible next step.
            </p>
          </div>
          <div className="button-row">
            <a className="button button--primary" href="/contact/#enquiry">
              Start a Conversation
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
