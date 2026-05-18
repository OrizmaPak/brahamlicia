import React, { useEffect, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import {
  audiences,
  faqItems,
  heroMoments,
  homeHighlights,
  imageLibrary,
  insights,
  processSteps,
  serviceOfferings,
} from '../content/siteContent.js'

const homeWhyCards = [
  {
    eyebrow: 'Approach',
    description: 'Advice shaped around people, context, and real operating conditions.',
    title: 'Human-centred thinking',
  },
  {
    eyebrow: 'Execution',
    description: 'Clear recommendations built to move from decision to action quickly.',
    title: 'Practical delivery',
  },
  {
    eyebrow: 'Control',
    description: 'Structured engagement with enough flexibility for real-world complexity.',
    title: 'Disciplined flexibility',
  },
  {
    eyebrow: 'Outcome',
    description: 'Stronger clarity, sharper capability, and better operating confidence.',
    title: 'Visible progress',
  },
]

export function HomePage({ pageId }) {
  const [activeHeroMoment, setActiveHeroMoment] = useState(0)
  const [activeFaqQuestion, setActiveFaqQuestion] = useState(faqItems[0]?.question ?? '')

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setActiveHeroMoment((current) => (current + 1) % heroMoments.length)
    }, 5000)

    return () => window.clearTimeout(timerId)
  }, [activeHeroMoment])

  const activeMoment = heroMoments[activeHeroMoment]

  return (
    <SiteLayout pageId={pageId}>
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="section-eyebrow">Independent consulting brand</p>
            <h1 className="hero-title">
              Clarity and structure for
              <span> teams in motion.</span>
            </h1>
            <p className="hero-text">
              Strategic clarity and cleaner execution for businesses, institutions, and leaders.
            </p>
            <div className="button-row">
              <a className="button button--primary" href="/contact/#enquiry">
                Book a Consultation
              </a>
              <a className="button button--secondary" href="/services/">
                Explore Our Services
              </a>
            </div>
            <div className="highlight-list">
              {homeHighlights.map((item) => (
                <span className="highlight-chip" key={item}>
                  {item}
                </span>
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
                  <span>{moment.label}</span>
                  <strong>{moment.title}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="hero-media" data-reveal style={{ '--delay': '140ms' }}>
            <div className="hero-stage">
              <div className="hero-stage__orb" />
              <div className="hero-stage__beam" />
              <figure className="hero-stage__panel hero-stage__panel--image" key={activeMoment.id}>
                <img alt={activeMoment.image.alt} src={activeMoment.image.src} />
                <figcaption>{activeMoment.imageCaption}</figcaption>
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
                  <strong>{activeMoment.label}</strong>
                </div>
                <span>{activeMoment.categoryLabel}</span>
                <strong className="hero-stage__panel-title">{activeMoment.categoryTitle}</strong>
                <p className="hero-stage__panel-note">{activeMoment.panelNote}</p>
                <ul>
                  {activeMoment.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="hero-stage__panel-feeling">
                  <span>What clients feel</span>
                  <strong>{activeMoment.feeling}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft section--aurora">
        <div className="container split-layout split-layout--story">
          <SectionHeading
            eyebrow="A consulting brand built for progress"
            title="Intentional growth. Practical execution. Better control."
            description="We help organisations, teams, and professionals strengthen direction, improve performance, and build systems that support sustainable results."
          />
          <div className="story-card story-card--visual" data-reveal style={{ '--delay': '120ms' }}>
            <div className="story-card__visual-stage">
              <figure className="story-card__image story-card__image--primary">
                <img alt={imageLibrary.strategy.alt} loading="lazy" src={imageLibrary.strategy.src} />
              </figure>
              <figure className="story-card__image story-card__image--floating">
                <img alt={imageLibrary.collaboration.alt} loading="lazy" src={imageLibrary.collaboration.src} />
              </figure>
              <div className="story-card__signal">
                <span>Operating mode</span>
                <strong>Quiet authority.</strong>
              </div>
            </div>
            <div className="story-card__content">
              <p>
                Our approach combines strategic thinking with practical implementation. That
                means we do not stop at ideas. We help shape them into action, structure, and
                measurable progress.
              </p>
              <div className="story-track">
                <article className="story-track__item">
                  <span className="story-track__index">01</span>
                  <div className="story-track__body">
                    <strong>Clarity first</strong>
                    <p>Define the path before pushing for speed.</p>
                  </div>
                </article>
                <article className="story-track__item">
                  <span className="story-track__index">02</span>
                  <div className="story-track__body">
                    <strong>Build clean systems</strong>
                    <p>Reduce friction with better working structure.</p>
                  </div>
                </article>
                <article className="story-track__item">
                  <span className="story-track__index">03</span>
                  <div className="story-track__body">
                    <strong>Hold the gain</strong>
                    <p>Turn improvement into a lasting operating rhythm.</p>
                  </div>
                </article>
              </div>
              <div className="story-card__footer">
                <div className="illustration-card illustration-card--compact">
                  <div className="illustration-card__header">
                    <span>Operating stance</span>
                    <strong>Quiet confidence. Sharp structure. Clear decisions.</strong>
                  </div>
                </div>
                <a className="text-link" href="/about/">
                  Learn more about the consulting approach
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon section--home-services">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="Focused support across consulting, learning, and advisory."
            description="Three service lines designed for clear decisions, stronger execution, and durable results."
          />
          <div className="card-grid card-grid--services">
            {serviceOfferings.map((service, index) => (
              <article
                className="service-card service-card--showcase"
                data-reveal
                key={service.anchor}
                style={{ '--delay': `${index * 90}ms` }}
              >
                <a className="service-card__surface" href={`/services/#${service.anchor}`}>
                  <figure className="service-card__media service-card__media--showcase">
                    <img alt={service.image.alt} loading="lazy" src={service.image.src} />
                    <span className="service-card__media-index">{String(index + 1).padStart(2, '0')}</span>
                  </figure>
                  <div className="service-card__body service-card__body--showcase">
                    <span className="service-card__pill">{service.category}</span>
                    <h3>{service.title}</h3>
                    <p className="service-card__summary--showcase">{service.summary}</p>
                    <ul className="mini-list mini-list--showcase">
                      {service.points.slice(0, 2).map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <span className="text-link">Explore service</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--halo section--home-why">
        <div className="container">
          <SectionHeading
            eyebrow="Why Braham Licia Consulting"
            title="A calm, strategic partner with financial-grade discipline."
            description="We combine clarity, professionalism, and practical thinking to help clients move from challenge to progress."
          />
          <div className="why-grid">
            <div className="card-grid card-grid--two why-grid__cards">
              {homeWhyCards.map((item, index) => (
                <article
                  className="feature-card"
                  data-reveal
                  key={item.title}
                  style={{ '--delay': `${index * 90}ms` }}
                >
                  <span className="feature-card__eyebrow">{item.eyebrow}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>

            <div className="why-stage" data-reveal style={{ '--delay': '160ms' }}>
              <figure className="why-stage__main">
                <img alt={imageLibrary.leadership.alt} loading="lazy" src={imageLibrary.leadership.src} />
              </figure>
              <figure className="why-stage__accent">
                <img alt={imageLibrary.boardroom.alt} loading="lazy" src={imageLibrary.boardroom.src} />
              </figure>
              <div className="illustration-card illustration-card--compact why-stage__note">
                <div className="illustration-card__header">
                  <span>Client experience</span>
                  <strong>Measured thinking with visible operational control.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--mesh section--home-process">
        <div className="container">
          <SectionHeading
            eyebrow="How we work"
            title="A simple, structured pathway from discovery to stronger delivery."
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
                  <span>{step.number}</span>
                  <strong>{step.title}</strong>
                </div>
                <p>{step.description}</p>
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
              <img alt={imageLibrary.collaboration.alt} loading="lazy" src={imageLibrary.collaboration.src} />
            </figure>
            <SectionHeading
              eyebrow="Who we serve"
              title="Designed for organisations, teams, and professionals committed to intentional growth."
              description="The About page carries the full audience fit, thought leadership, and brand story so visitors can understand relevance quickly."
            />
            <div className="stacked-points">
              {audiences.slice(0, 3).map((audience) => (
                <div key={audience.title}>
                  <strong>{audience.title}</strong>
                  <p>{audience.description}</p>
                </div>
              ))}
            </div>
            <a className="button button--secondary" href="/about/#who-we-serve">
              See who we serve
            </a>
          </div>

          <div className="preview-card preview-card--insights" data-reveal style={{ '--delay': '140ms' }}>
            <figure className="preview-card__media">
              <img alt={imageLibrary.insightDesk.alt} loading="lazy" src={imageLibrary.insightDesk.src} />
            </figure>
            <SectionHeading
              eyebrow="Insights"
              title="Ideas for growth and better decision-making."
              description="We surface reflections on leadership, systems, professional development, and organisational effectiveness inside the About experience."
            />
            <div className="insight-stack">
              {insights.map((entry) => (
                <article className="insight-snippet" key={entry.title}>
                  <span>{entry.category}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt}</p>
                </article>
              ))}
            </div>
            <a className="button button--secondary" href="/about/#insights">
              Visit insights
            </a>
          </div>
        </div>
      </section>

      <section className="section section--aurora section--home-faq" id="faq">
        <div className="container split-layout split-layout--wide">
          <div data-reveal>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Quick clarity before we start working together."
              description="Clear answers on fit, delivery format, service customisation, and how to choose the right engagement path."
            />
            <div className="story-card story-card--media">
              <p>
                You do not need to fully map the whole engagement before reaching out. A short
                conversation helps define the most practical next step.
              </p>
              <figure className="story-card__image">
                <img alt={imageLibrary.leadership.alt} loading="lazy" src={imageLibrary.leadership.src} />
              </figure>
            </div>
          </div>

          <div className="faq-stack" data-reveal style={{ '--delay': '120ms' }}>
            {faqItems.map((item) => (
              <details
                className="faq-item"
                key={item.question}
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    setActiveFaqQuestion(item.question)
                  } else if (activeFaqQuestion === item.question) {
                    setActiveFaqQuestion('')
                  }
                }}
                open={activeFaqQuestion === item.question}
              >
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--home-cta">
        <div className="container cta-panel" data-reveal>
          <div className="cta-panel__content">
            <p className="section-eyebrow">Ready to build with more clarity and confidence?</p>
            <h2 className="section-title">Consulting, training, and guidance for forward movement.</h2>
            <p className="section-description">
              Structured support to help your team move with clarity and purpose.
            </p>
          </div>
          <div className="button-row">
            <a className="button button--primary" href="/contact/#enquiry">
              Book a Consultation
            </a>
            <a className="button button--secondary" href="/contact/#enquiry">
              Send an Enquiry
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
