import React, { useEffect, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { EditableImage } from '../components/editor/EditableImage.jsx'
import { EditableLink } from '../components/editor/EditableLink.jsx'
import { EditableText } from '../components/editor/EditableText.jsx'
import { HomeContentProvider, useHomeContent } from '../context/HomeContentContext.jsx'
import { getLinkField } from '../content/homeContentFields.js'
import {
  audiences,
  faqItems,
  heroMoments,
  homeHighlights,
  insights,
  processSteps,
  serviceOfferings,
} from '../content/siteContent.js'

function Heading({ descriptionKey, eyebrowKey, titleKey }) {
  return (
    <SectionHeading
      eyebrow={<EditableText fieldKey={eyebrowKey} label={eyebrowKey} />}
      title={<EditableText fieldKey={titleKey} label={titleKey} />}
      description={descriptionKey ? <EditableText fieldKey={descriptionKey} label={descriptionKey} multiline /> : null}
    />
  )
}

function HomePageContent({ pageId }) {
  const { fields, isLoading } = useHomeContent()
  const [activeHeroMoment, setActiveHeroMoment] = useState(0)
  const [activeFaqIndex, setActiveFaqIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setActiveHeroMoment((current) => (current + 1) % heroMoments.length)
    }, 5000)

    return () => window.clearTimeout(timerId)
  }, [activeHeroMoment])

  const activeMoment = heroMoments[activeHeroMoment]
  const activeMomentKey = `hero.moments.${activeHeroMoment}`

  return (
    <SiteLayout pageId={pageId}>
      {isLoading ? <div className="home-content-loader" aria-hidden="true" /> : null}
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy" data-reveal>
            <EditableText as="p" className="section-eyebrow" fieldKey="hero.eyebrow" label="Hero eyebrow" />
            <h1 className="hero-title">
              <EditableText fieldKey="hero.title.main" label="Hero title main text" />
              <EditableText as="span" fieldKey="hero.title.accent" label="Hero title accent text" />
            </h1>
            <EditableText as="p" className="hero-text" fieldKey="hero.description" label="Hero paragraph" multiline />
            <div className="button-row">
              <EditableLink className="button button--primary" fieldKey="hero.cta.primary" label="Hero primary CTA" />
              <EditableLink className="button button--secondary" fieldKey="hero.cta.secondary" label="Hero secondary CTA" />
            </div>
            <div className="highlight-list">
              {homeHighlights.map((item, index) => (
                <EditableText
                  as="span"
                  className="highlight-chip"
                  fieldKey={`hero.highlights.${index}.label`}
                  key={item}
                  label={`Hero highlight ${index + 1}`}
                />
              ))}
            </div>
            <div
              aria-label="Hero highlights"
              className="hero-ledger"
              style={{
                '--active-index': activeHeroMoment,
                '--hero-card-count': heroMoments.length,
              }}
            >
              <div aria-hidden="true" className="hero-ledger__flow" />
              {heroMoments.map((moment, index) => (
                <button
                  aria-pressed={activeHeroMoment === index}
                  className={`hero-ledger__item${activeHeroMoment === index ? ' is-active' : ''}`}
                  key={moment.id}
                  onClick={() => setActiveHeroMoment(index)}
                  type="button"
                >
                  <EditableText as="span" fieldKey={`hero.moments.${index}.label`} label={`Hero moment ${index + 1} label`} />
                  <EditableText as="strong" fieldKey={`hero.moments.${index}.title`} label={`Hero moment ${index + 1} title`} />
                </button>
              ))}
            </div>
          </div>

          <div className="hero-media" data-reveal style={{ '--delay': '140ms' }}>
            <div className="hero-stage">
              <div className="hero-stage__orb" />
              <div className="hero-stage__beam" />
              <figure className="hero-stage__panel hero-stage__panel--image" key={activeMoment.id}>
                <EditableImage fieldKey={`${activeMomentKey}.image`} label={`Hero moment ${activeHeroMoment + 1} image`} />
                <figcaption>
                  <EditableText fieldKey={`${activeMomentKey}.imageCaption`} label={`Hero moment ${activeHeroMoment + 1} image caption`} />
                </figcaption>
              </figure>
              <div className="hero-stage__panel hero-stage__panel--stack" key={`${activeMoment.id}-stack`}>
                <div className="hero-mobile-indicator">
                  <div aria-hidden="true" className="hero-mobile-indicator__dots">
                    {heroMoments.map((moment, index) => (
                      <span
                        className={`hero-mobile-indicator__dot${activeHeroMoment === index ? ' is-active' : ''}`}
                        key={moment.id}
                      />
                    ))}
                  </div>
                  <EditableText as="strong" fieldKey={`${activeMomentKey}.label`} label={`Hero moment ${activeHeroMoment + 1} mobile label`} />
                </div>
                <EditableText as="span" fieldKey={`${activeMomentKey}.categoryLabel`} label={`Hero moment ${activeHeroMoment + 1} category label`} />
                <EditableText as="strong" className="hero-stage__panel-title" fieldKey={`${activeMomentKey}.categoryTitle`} label={`Hero moment ${activeHeroMoment + 1} category title`} />
                <EditableText as="p" className="hero-stage__panel-note" fieldKey={`${activeMomentKey}.panelNote`} label={`Hero moment ${activeHeroMoment + 1} panel note`} />
                <ul>
                  {activeMoment.points.map((point, pointIndex) => (
                    <li key={point}>
                      <EditableText fieldKey={`${activeMomentKey}.points.${pointIndex}`} label={`Hero moment ${activeHeroMoment + 1} bullet ${pointIndex + 1}`} />
                    </li>
                  ))}
                </ul>
                <div className="hero-stage__panel-feeling">
                  <span>What clients feel</span>
                  <EditableText as="strong" fieldKey={`${activeMomentKey}.feeling`} label={`Hero moment ${activeHeroMoment + 1} feeling`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft section--aurora">
        <div className="container split-layout split-layout--story">
          <Heading
            eyebrowKey="story.heading.eyebrow"
            titleKey="story.heading.title"
            descriptionKey="story.heading.description"
          />
          <div className="story-card story-card--visual" data-reveal style={{ '--delay': '120ms' }}>
            <div className="story-card__visual-stage">
              <figure className="story-card__image story-card__image--primary">
                <EditableImage fieldKey="story.images.primary" label="Story primary image" loading="lazy" />
              </figure>
              <figure className="story-card__image story-card__image--floating">
                <EditableImage fieldKey="story.images.floating" label="Story floating image" loading="lazy" />
              </figure>
              <div className="story-card__signal">
                <EditableText as="span" fieldKey="story.signal.label" label="Story signal label" />
                <EditableText as="strong" fieldKey="story.signal.title" label="Story signal title" />
              </div>
            </div>
            <div className="story-card__content">
              <EditableText as="p" fieldKey="story.body" label="Story paragraph" multiline />
              <div className="story-track">
                {[0, 1, 2].map((index) => (
                  <article className="story-track__item" key={index}>
                    <span className="story-track__index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="story-track__body">
                      <EditableText as="strong" fieldKey={`story.tracks.${index}.title`} label={`Story track ${index + 1} title`} />
                      <EditableText as="p" fieldKey={`story.tracks.${index}.description`} label={`Story track ${index + 1} description`} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="story-card__footer">
                <div className="illustration-card illustration-card--compact">
                  <div className="illustration-card__header">
                    <EditableText as="span" fieldKey="story.footer.label" label="Story footer label" />
                    <EditableText as="strong" fieldKey="story.footer.title" label="Story footer title" />
                  </div>
                </div>
                <EditableLink className="text-link" fieldKey="story.footer.link" label="Story footer link" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon section--home-services">
        <div className="container">
          <Heading
            eyebrowKey="servicesPreview.heading.eyebrow"
            titleKey="servicesPreview.heading.title"
            descriptionKey="servicesPreview.heading.description"
          />
          <div className="card-grid card-grid--services">
            {serviceOfferings.map((service, index) => {
              const linkField = getLinkField(fields, `servicesPreview.cards.${index}.link`)

              return (
                <article
                  className="service-card service-card--showcase"
                  data-reveal
                  key={service.anchor}
                  style={{ '--delay': `${index * 90}ms` }}
                >
                  <a className="service-card__surface" href={linkField.href}>
                    <figure className="service-card__media service-card__media--showcase">
                      <EditableImage fieldKey={`servicesPreview.cards.${index}.image`} label={`Service preview ${index + 1} image`} loading="lazy" />
                      <span className="service-card__media-index">{String(index + 1).padStart(2, '0')}</span>
                    </figure>
                    <div className="service-card__body service-card__body--showcase">
                      <EditableText as="span" className="service-card__pill" fieldKey={`servicesPreview.cards.${index}.category`} label={`Service preview ${index + 1} category`} />
                      <EditableText as="h3" fieldKey={`servicesPreview.cards.${index}.title`} label={`Service preview ${index + 1} title`} />
                      <EditableText as="p" className="service-card__summary--showcase" fieldKey={`servicesPreview.cards.${index}.summary`} label={`Service preview ${index + 1} summary`} multiline />
                      <ul className="mini-list mini-list--showcase">
                        {service.points.slice(0, 2).map((point, pointIndex) => (
                          <li key={point}>
                            <EditableText fieldKey={`servicesPreview.cards.${index}.points.${pointIndex}`} label={`Service preview ${index + 1} point ${pointIndex + 1}`} />
                          </li>
                        ))}
                      </ul>
                      <EditableLink className="text-link" fieldKey={`servicesPreview.cards.${index}.link`} label={`Service preview ${index + 1} CTA`} />
                    </div>
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft section--halo section--home-why">
        <div className="container">
          <Heading
            eyebrowKey="why.heading.eyebrow"
            titleKey="why.heading.title"
            descriptionKey="why.heading.description"
          />
          <div className="why-grid">
            <div className="card-grid card-grid--two why-grid__cards">
              {[0, 1, 2, 3].map((index) => (
                <article
                  className="feature-card"
                  data-reveal
                  key={index}
                  style={{ '--delay': `${index * 90}ms` }}
                >
                  <EditableText as="span" className="feature-card__eyebrow" fieldKey={`why.cards.${index}.eyebrow`} label={`Why card ${index + 1} eyebrow`} />
                  <EditableText as="h3" fieldKey={`why.cards.${index}.title`} label={`Why card ${index + 1} title`} />
                  <EditableText as="p" fieldKey={`why.cards.${index}.description`} label={`Why card ${index + 1} description`} multiline />
                </article>
              ))}
            </div>

            <div className="why-stage" data-reveal style={{ '--delay': '160ms' }}>
              <figure className="why-stage__main">
                <EditableImage fieldKey="why.images.main" label="Why main image" loading="lazy" />
              </figure>
              <figure className="why-stage__accent">
                <EditableImage fieldKey="why.images.accent" label="Why accent image" loading="lazy" />
              </figure>
              <div className="illustration-card illustration-card--compact why-stage__note">
                <div className="illustration-card__header">
                  <EditableText as="span" fieldKey="why.note.label" label="Why note label" />
                  <EditableText as="strong" fieldKey="why.note.title" label="Why note title" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--mesh section--home-process">
        <div className="container">
          <SectionHeading
            eyebrow={<EditableText fieldKey="process.heading.eyebrow" label="Process heading eyebrow" />}
            title={<EditableText fieldKey="process.heading.title" label="Process heading title" />}
          />
          <div className="timeline-grid">
            {processSteps.map((step, index) => (
              <article
                className="timeline-card"
                data-reveal
                key={step.number}
                style={{ '--delay': `${index * 80}ms`, '--timeline-order': index }}
              >
                <div className="timeline-card__head">
                  <EditableText as="span" fieldKey={`process.steps.${index}.number`} label={`Process step ${index + 1} number`} />
                  <EditableText as="strong" fieldKey={`process.steps.${index}.title`} label={`Process step ${index + 1} title`} />
                </div>
                <EditableText as="p" fieldKey={`process.steps.${index}.description`} label={`Process step ${index + 1} description`} multiline />
                <div className="timeline-card__tail" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--spotlight section--home-preview">
        <div className="container preview-grid">
          <div className="preview-card" data-reveal>
            <figure className="preview-card__media">
              <EditableImage fieldKey="audiencePreview.image" label="Audience preview image" loading="lazy" />
            </figure>
            <Heading
              eyebrowKey="audiencePreview.heading.eyebrow"
              titleKey="audiencePreview.heading.title"
              descriptionKey="audiencePreview.heading.description"
            />
            <div className="stacked-points">
              {audiences.slice(0, 3).map((audience, index) => (
                <div key={audience.title}>
                  <EditableText as="strong" fieldKey={`audiencePreview.items.${index}.title`} label={`Audience preview ${index + 1} title`} />
                  <EditableText as="p" fieldKey={`audiencePreview.items.${index}.description`} label={`Audience preview ${index + 1} description`} multiline />
                </div>
              ))}
            </div>
            <EditableLink className="button button--secondary" fieldKey="audiencePreview.link" label="Audience preview button" />
          </div>

          <div className="preview-card preview-card--insights" data-reveal style={{ '--delay': '140ms' }}>
            <figure className="preview-card__media">
              <EditableImage fieldKey="insightsPreview.image" label="Insights preview image" loading="lazy" />
            </figure>
            <Heading
              eyebrowKey="insightsPreview.heading.eyebrow"
              titleKey="insightsPreview.heading.title"
              descriptionKey="insightsPreview.heading.description"
            />
            <div className="insight-stack">
              {insights.map((entry, index) => (
                <article className="insight-snippet" key={entry.title}>
                  <EditableText as="span" fieldKey={`insightsPreview.items.${index}.category`} label={`Insight preview ${index + 1} category`} />
                  <EditableText as="h3" fieldKey={`insightsPreview.items.${index}.title`} label={`Insight preview ${index + 1} title`} />
                  <EditableText as="p" fieldKey={`insightsPreview.items.${index}.excerpt`} label={`Insight preview ${index + 1} excerpt`} multiline />
                </article>
              ))}
            </div>
            <EditableLink className="button button--secondary" fieldKey="insightsPreview.link" label="Insights preview button" />
          </div>
        </div>
      </section>

      <section className="section section--aurora section--home-faq" id="faq">
        <div className="container split-layout split-layout--wide">
          <div data-reveal>
            <Heading
              eyebrowKey="faqPreview.heading.eyebrow"
              titleKey="faqPreview.heading.title"
              descriptionKey="faqPreview.heading.description"
            />
            <div className="story-card story-card--media">
              <EditableText as="p" fieldKey="faqPreview.intro" label="FAQ preview intro paragraph" multiline />
              <figure className="story-card__image">
                <EditableImage fieldKey="faqPreview.image" label="FAQ preview image" loading="lazy" />
              </figure>
            </div>
          </div>

          <div className="faq-stack" data-reveal style={{ '--delay': '120ms' }}>
            {faqItems.map((item, index) => (
              <details
                className="faq-item"
                key={item.question}
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    setActiveFaqIndex(index)
                  } else if (activeFaqIndex === index) {
                    setActiveFaqIndex(null)
                  }
                }}
                open={activeFaqIndex === index}
              >
                <summary>
                  <EditableText fieldKey={`faqPreview.items.${index}.question`} label={`FAQ ${index + 1} question`} />
                </summary>
                <EditableText as="p" fieldKey={`faqPreview.items.${index}.answer`} label={`FAQ ${index + 1} answer`} multiline />
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--home-cta">
        <div className="container cta-panel" data-reveal>
          <div className="cta-panel__content">
            <EditableText as="p" className="section-eyebrow" fieldKey="cta.eyebrow" label="CTA eyebrow" />
            <EditableText as="h2" className="section-title" fieldKey="cta.title" label="CTA title" />
            <EditableText as="p" className="section-description" fieldKey="cta.description" label="CTA description" multiline />
          </div>
          <div className="button-row">
            <EditableLink className="button button--primary" fieldKey="cta.primary" label="CTA primary button" />
            <EditableLink className="button button--secondary" fieldKey="cta.secondary" label="CTA secondary button" />
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

export function HomePage({ pageId }) {
  return (
    <HomeContentProvider>
      <HomePageContent pageId={pageId} />
    </HomeContentProvider>
  )
}
