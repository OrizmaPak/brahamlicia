import React from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { useSiteContent } from '../context/useSiteContent.js'

export function AboutPage({ pageId }) {
  const { audiences, imageLibrary, insights, values } = useSiteContent()

  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--about section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <p className="section-eyebrow">About Braham Licia Consulting</p>
            <h1 className="page-hero__title">
              A modern consulting brand helping people, teams, and organisations move from
              complexity to clarity.
            </h1>
            <p className="page-hero__text">
              Our consulting approach is rooted in intentional growth, practical structure,
              human-centred thinking, and confidence-building support for stronger results.
            </p>
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <img alt={imageLibrary.about.alt} src={imageLibrary.about.src} />
          </figure>
        </div>
      </section>

      <section className="section section--aurora section--about-story">
        <div className="container split-layout">
          <SectionHeading
            eyebrow="Who we are"
            title="Thoughtful consulting for intentional growth."
            description="Braham Licia Consulting is a consulting and professional development brand committed to helping businesses, institutions, and professionals grow with intention."
          />
          <div className="about-story about-story--minimal" data-reveal style={{ '--delay': '120ms' }}>
            <div className="rich-copy about-story__content">
              <p>
                We provide advisory support, learning interventions, and strategic guidance that
                improve clarity, strengthen systems, and support meaningful outcomes.
              </p>
              <p>
                Our approach is human-centred and practical, helping clients translate goals into
                realistic plans and visible progress with stronger internal alignment.
              </p>
              <div className="about-story__pillars">
                <span>Clarity-led strategy</span>
                <span>Human-centred execution</span>
                <span>Sustainable capability</span>
              </div>
            </div>

            <figure className="about-story__media">
              <img alt={imageLibrary.collaboration.alt} loading="lazy" src={imageLibrary.collaboration.src} />
              <figcaption className="about-story__badge">
                <span>Consulting rhythm</span>
                <strong>Listen, align, and execute with control.</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--soft section--ribbon section--about-mission">
        <div className="container card-grid card-grid--two">
          <article className="mission-card" data-reveal>
            <figure className="mission-card__media">
              <img alt={imageLibrary.workspace.alt} loading="lazy" src={imageLibrary.workspace.src} />
            </figure>
            <p className="section-eyebrow">Our mission</p>
            <h3>To help people and organisations grow with clarity, competence, and impact.</h3>
            <p>
              We provide thoughtful consulting, professional development, and strategic support
              that turns goals into practical progress.
            </p>
          </article>
          <article className="mission-card" data-reveal style={{ '--delay': '120ms' }}>
            <figure className="mission-card__media">
              <img alt={imageLibrary.office.alt} loading="lazy" src={imageLibrary.office.src} />
            </figure>
            <p className="section-eyebrow">Our vision</p>
            <h3>To be a trusted consulting brand known for stronger systems and meaningful progress.</h3>
            <p>
              We want to be recognised for helping clients build better leadership, stronger
              delivery, and more confident growth pathways.
            </p>
          </article>
        </div>
      </section>

      <section className="section section--mesh section--about-approach">
        <div className="container split-layout split-layout--wide">
          <div className="about-approach__intro" data-reveal>
            <SectionHeading
              eyebrow="Our approach"
              title="Clear, collaborative, practical."
              description="We listen deeply, understand context, and shape solutions that are relevant, realistic, and sustainable."
            />
            <p className="section-description">
              We do not believe in one-size-fits-all recommendations. Every business,
              institution, and team has its own realities. That is why our consulting process
              is built around context, people, and practical implementation.
            </p>
            <div className="about-approach__visual">
              <figure className="about-approach__media">
                <img alt={imageLibrary.leadership.alt} loading="lazy" src={imageLibrary.leadership.src} />
              </figure>
              <div className="about-approach__signal">
                <span>Delivery mindset</span>
                <strong>Context-first strategy with practical implementation discipline.</strong>
              </div>
              <div className="about-approach__track">
                <span>Context</span>
                <span>Collaboration</span>
                <span>Execution</span>
              </div>
            </div>
          </div>
          <div className="value-grid" data-reveal style={{ '--delay': '140ms' }}>
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--halo section--about-audiences" id="who-we-serve">
        <div className="container">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for organisations, teams, professionals, and leaders who want to grow well."
            description="We support a range of audiences, but the common need is the same: clearer direction, stronger systems, more effective people, and better delivery."
          />
          <div className="about-audiences__layout">
            <div className="about-audiences__canvas" data-reveal style={{ '--delay': '80ms' }}>
              <figure className="about-audiences__image about-audiences__image--main">
                <img alt={imageLibrary.boardroom.alt} loading="lazy" src={imageLibrary.boardroom.src} />
              </figure>
              <figure className="about-audiences__image about-audiences__image--float">
                <img alt={imageLibrary.training.alt} loading="lazy" src={imageLibrary.training.src} />
              </figure>
              <p className="about-audiences__quote">
                Growth becomes meaningful when people, systems, and purpose move in alignment.
              </p>
            </div>
            <div className="card-grid card-grid--audiences about-audiences__cards">
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
          </div>
        </div>
      </section>

      <section className="section section--spotlight section--about-insights" id="insights">
        <div className="container about-insights">
          <div className="about-insights__head" data-reveal>
            <SectionHeading
              eyebrow="Insights"
              title="Thought leadership that supports better decisions."
              description="Leading consulting brands make space for their thinking, not only their services. Here the About page carries a visible insight layer so the brand reads as thoughtful, not transactional."
            />
            <p className="about-insights__lead">
              This layer positions the brand as a thinking partner, where insights are designed
              to sharpen choices, not just fill space.
            </p>
          </div>
          <div className="about-insights__layout">
            <div className="about-insights__stage" data-reveal style={{ '--delay': '110ms' }}>
              <figure className="about-insights__image about-insights__image--primary">
                <img alt={imageLibrary.strategy.alt} loading="lazy" src={imageLibrary.strategy.src} />
              </figure>
              <figure className="about-insights__image about-insights__image--secondary">
                <img alt={imageLibrary.insightDesk.alt} loading="lazy" src={imageLibrary.insightDesk.src} />
              </figure>
              <div className="about-insights__quote">
                <span>Thinking layer</span>
                <strong>Structure insight into decisions people can execute.</strong>
              </div>
              <div className="about-insights__tags">
                <span>Leadership</span>
                <span>Systems</span>
                <span>Capability</span>
              </div>
            </div>
            <div className="about-insights__feed" data-reveal style={{ '--delay': '170ms' }}>
              {insights.map((entry) => (
                <article className="insight-card about-insights__item" key={entry.title}>
                  <span>{entry.category}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--about-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <p className="section-eyebrow">Let's move your work forward</p>
            <h2 className="section-title">
              Stronger structure, clearer thinking, and more confident progress start with a
              focused conversation.
            </h2>
          </div>
          <div className="button-row">
            <a className="button button--primary" href="/contact/#enquiry">
              Work With Us
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
