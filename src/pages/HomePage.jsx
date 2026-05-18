import React, { useEffect, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { useSiteContent } from '../context/useSiteContent.js'

const homeWhyCards = [
  {
    eyebrow: 'Approach',
    description: 'Recommendations shaped around your real context, priorities, and constraints.',
    title: 'Context before templates',
  },
  {
    eyebrow: 'Execution',
    description: 'Clear next steps that people can act on, not vague ideas that sit on a shelf.',
    title: 'Advice you can use',
  },
  {
    eyebrow: 'Capability',
    description: 'Support that strengthens both the people doing the work and the systems around it.',
    title: 'People and systems together',
  },
  {
    eyebrow: 'Style',
    description: 'A calm working style that keeps the engagement focused and easy to follow.',
    title: 'Structured partnership',
  },
]

const homeJourneyCards = [
  {
    description: 'Align priorities, sharpen the direction, and decide what matters now.',
    title: 'Clarify the work',
  },
  {
    description: 'Build capability through training, leadership support, and team development.',
    title: 'Strengthen the people',
  },
  {
    description: 'Add structure, coordination, and follow-through around important initiatives.',
    title: 'Support the delivery',
  },
]

const homeWorldPillars = [
  {
    id: 'growth',
    label: 'Expansion Logic',
    title: 'Intentional Growth',
    description:
      'Shape ambition into a sequenced growth path with sharper positioning, stronger priorities, and commercial direction that can scale.',
    points: ['Market clarity', 'Roadmap design'],
  },
  {
    id: 'execution',
    label: 'Operational Rhythm',
    title: 'Practical Execution',
    description:
      'Turn strategy into visible movement through better workflows, stronger coordination, and delivery habits that hold under pressure.',
    points: ['Delivery systems', 'Team alignment'],
  },
  {
    id: 'control',
    label: 'Decision Intelligence',
    title: 'Data Control',
    description:
      'Create cleaner visibility around performance, risk, and next-step decisions so leaders can act with more confidence.',
    points: ['Insight layers', 'Performance control'],
  },
]

const homeSpinWords = [
  'Strategy',
  'Capability',
  'Delivery',
  'Clarity',
  'Growth',
  'Method',
  'Strategy',
  'Capability',
  'Delivery',
  'Clarity',
  'Growth',
  'Method',
]

const homeSpinWordsInner = [
  'Focus',
  'Structure',
  'Signal',
  'Motion',
  'Focus',
  'Structure',
  'Signal',
  'Motion',
]

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function HomePage({ pageId }) {
  const {
    audiences,
    faqItems,
    heroMoments,
    homeHighlights,
    imageLibrary,
    testimonials,
    processSteps,
    serviceOfferings,
  } = useSiteContent()
  const [activeHeroMoment, setActiveHeroMoment] = useState(0)
  const [activeFaqQuestion, setActiveFaqQuestion] = useState(faqItems[0]?.question ?? '')
  const featuredTestimonial = testimonials[0]
  const supportingTestimonials = testimonials.slice(1, 4)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setActiveHeroMoment((current) => (current + 1) % heroMoments.length)
    }, 5000)

    return () => window.clearTimeout(timerId)
  }, [activeHeroMoment, heroMoments.length])

  const activeMoment = heroMoments[activeHeroMoment]

  return (
    <SiteLayout pageId={pageId}>
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="section-eyebrow">Consulting, training, and advisory support</p>
            <h1 className="hero-title">
              Consulting for teams that need clarity.
              <span> Strategy. Capability. Delivery.</span>
            </h1>
            <p className="hero-text">
              We help businesses, institutions, and leaders strengthen structure, build capable
              people, and move important work forward.
            </p>
            <div className="button-row">
              <a className="button button--primary" href="/contact/#enquiry">
                Book a Consultation
              </a>
              <a className="button button--secondary" href="/services/">
                See Service Lines
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
              aria-label="Service focus"
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
                  <span>What clients gain</span>
                  <strong>{activeMoment.feeling}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--prism section--home-pillars">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Strategic mark"
            title="Intentional Growth. Practical Execution. Data Control."
            description="A spinning wordmark that turns the core method into a cleaner, more captivating visual system."
          />
          <div className="wordmark-stage" data-reveal style={{ '--delay': '120ms' }}>
            <div className="wordmark-stage__logo" aria-hidden="true">
              <div className="wordmark-stage__halo wordmark-stage__halo--one" />
              <div className="wordmark-stage__halo wordmark-stage__halo--two" />
              <div className="wordmark-stage__ring wordmark-stage__ring--outer">
                {homeSpinWords.map((word, index) => (
                  <span key={`${word}-${index}`} style={{ '--word-index': index }}>
                    {word}
                  </span>
                ))}
              </div>
              <div className="wordmark-stage__ring wordmark-stage__ring--inner">
                {homeSpinWordsInner.map((word, index) => (
                  <span key={`${word}-${index}`} style={{ '--word-index': index }}>
                    {word}
                  </span>
                ))}
              </div>
              <div className="wordmark-stage__core">
                <span className="wordmark-stage__eyebrow">BLC Method</span>
                <strong className="wordmark-stage__word" data-text="CLARITY">
                  CLARITY
                </strong>
                <span className="wordmark-stage__subword">in motion</span>
              </div>
            </div>

            <div className="wordmark-stage__notes">
              {homeWorldPillars.map((pillar, index) => (
                <article className="wordmark-note" key={pillar.id}>
                  <span className="wordmark-note__index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="wordmark-note__body">
                    <span className="wordmark-note__label">{pillar.label}</span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <div className="wordmark-note__list">
                      {pillar.points.map((point) => (
                        <span key={point}>{point}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon section--home-services">
        <div className="container">
          <SectionHeading
            eyebrow="What we help with"
            title="Three clear service lines."
            description="Start with the support you need most: sharper strategy, stronger people, or better project delivery."
            align="center"
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
                    <span className="text-link">See service details</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--aurora">
        <div className="container split-layout split-layout--story">
          <SectionHeading
            align="center"
            eyebrow="Where clients usually start"
            title="Most engagements begin with one urgent need."
            description="We help clients identify the clearest starting point, then build the right level of support around it."
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
                <span>Starting point</span>
                <strong>Clear next steps.</strong>
              </div>
            </div>
            <div className="story-card__content">
              <p>
                Clients typically come to us when strategy feels scattered, teams need support,
                or delivery needs more structure.
              </p>
              <div className="story-track">
                {homeJourneyCards.map((item, index) => (
                  <article className="story-track__item" key={item.title}>
                    <span className="story-track__index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="story-track__body">
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="story-card__footer">
                <div className="illustration-card illustration-card--compact">
                  <div className="illustration-card__header">
                    <span>Practical fit</span>
                    <strong>Start with the clearest problem. Expand the support only if needed.</strong>
                  </div>
                </div>
                <a className="text-link" href="/services/">
                  See all service details
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft section--halo section--home-why">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Why clients choose us"
            title="Calm consulting with clear structure."
            description="We keep the work practical, focused, and easy to move on."
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
                  <strong>Clear thinking without unnecessary noise.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--mesh section--home-process">
        <div className="container">
          <SectionHeading
            eyebrow="How work starts"
            title="A simple path from first conversation to delivery."
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

      <section className="section section--soft section--spotlight section--home-audiences">
        <div className="container">
          <SectionHeading
            eyebrow="Who we work with"
            title="A strong fit for businesses, institutions, teams, and professionals."
            description="If you need clearer strategy, stronger capability, or more organised delivery, there is likely a good fit."
          />
          <div className="card-grid card-grid--two">
            {audiences.map((audience, index) => (
              <article
                className="audience-card"
                data-reveal
                key={audience.title}
                style={{ '--delay': `${index * 90}ms` }}
              >
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
              </article>
            ))}
          </div>
          <div className="button-row section-actions" data-reveal style={{ '--delay': '160ms' }}>
            <a className="button button--secondary" href="/about/#who-we-serve">
              See who we support
            </a>
          </div>
        </div>
      </section>

      <section className="section section--aurora section--home-faq" id="faq">
        <div className="container split-layout split-layout--wide">
          <div data-reveal>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Quick answers before you get in touch."
              description="Start here if you want clarity on fit, format, and the right service path."
            />
            <div className="story-card story-card--media">
              <p>
                You do not need a full brief before reaching out. A short conversation is enough
                to identify the best next step.
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

      <section className="section section--spotlight section--home-testimonials">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Testimonials"
            title="Calm structure. Practical delivery. Real client impact."
            description="A stronger look at the kind of clarity, confidence, and follow-through clients describe after the work lands."
          />
          <div className="testimonials-stage">
            {featuredTestimonial ? (
              <article className="testimonial-feature" data-reveal style={{ '--delay': '120ms' }}>
                <div className="testimonial-feature__visual" aria-hidden="true">
                  <div className="testimonial-feature__halo" />
                  <div className="testimonial-feature__orbit testimonial-feature__orbit--one" />
                  <div className="testimonial-feature__orbit testimonial-feature__orbit--two" />
                  <div className="testimonial-feature__monogram">
                    {getInitials(featuredTestimonial.author)}
                  </div>
                  <span className="testimonial-feature__caption">Client voice</span>
                </div>

                <div className="testimonial-feature__content">
                  <span className="testimonial-feature__eyebrow">Featured perspective</span>
                  {featuredTestimonial.quote ? (
                    <blockquote className="testimonial-feature__quote">
                      {featuredTestimonial.quote}
                    </blockquote>
                  ) : null}
                  <div className="testimonial-feature__meta">
                    <strong>{featuredTestimonial.author}</strong>
                    <span>{featuredTestimonial.role}</span>
                    <p>{featuredTestimonial.organisation}</p>
                  </div>
                  <div className="testimonial-feature__trust">
                    <span>Senior leadership trust</span>
                    <span>Operational clarity</span>
                    <span>Practical follow-through</span>
                  </div>
                </div>
              </article>
            ) : null}

            <div className="testimonial-cluster" data-reveal style={{ '--delay': '200ms' }}>
              {supportingTestimonials.map((testimonial, index) => (
                <article
                  className={`testimonial-panel testimonial-panel--${index + 1}`}
                  key={`${testimonial.author}-${testimonial.organisation}`}
                >
                  <div className="testimonial-panel__head">
                    <div className="testimonial-panel__avatar">{getInitials(testimonial.author)}</div>
                    <div className="testimonial-panel__person">
                      <strong>{testimonial.author}</strong>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>

                  {testimonial.quote ? (
                    <blockquote className="testimonial-panel__quote">{testimonial.quote}</blockquote>
                  ) : null}

                  <p className="testimonial-panel__org">{testimonial.organisation}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--home-cta">
        <div className="container cta-panel" data-reveal>
          <div className="cta-panel__content">
            <p className="section-eyebrow">Need help with strategy, training, or delivery?</p>
            <h2 className="section-title">
              Book a consultation and we will point you to the right support path.
            </h2>
            <p className="section-description">
              Start with the clearest need. We can scope the rest together.
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

