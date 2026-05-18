import React from 'react'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { SiteLayout } from '../components/SiteLayout.jsx'
import { EditableImage } from '../components/editor/EditableImage.jsx'
import { EditableLink } from '../components/editor/EditableLink.jsx'
import { EditableText } from '../components/editor/EditableText.jsx'
import { createAboutFallbackFields } from '../content/aboutContentFields.js'
import { audiences, insights, values } from '../content/siteContent.js'
import { PageContentProvider } from '../context/PageContentContext.jsx'

function AboutHeading({ eyebrowKey, titleKey, descriptionKey }) {
  return (
    <SectionHeading
      eyebrow={<EditableText fieldKey={eyebrowKey} label={eyebrowKey} />}
      title={<EditableText fieldKey={titleKey} label={titleKey} />}
      description={descriptionKey ? <EditableText fieldKey={descriptionKey} label={descriptionKey} multiline /> : null}
    />
  )
}

function AboutContent({ pageId }) {
  return (
    <SiteLayout pageId={pageId}>
      <section className="page-hero page-hero--about section section--soft">
        <div className="container page-hero__grid">
          <div data-reveal>
            <EditableText as="p" className="section-eyebrow" fieldKey="hero.eyebrow" label="About hero eyebrow" />
            <EditableText as="h1" className="page-hero__title" fieldKey="hero.title" label="About hero title" multiline />
            <EditableText as="p" className="page-hero__text" fieldKey="hero.description" label="About hero description" multiline />
          </div>
          <figure className="page-hero__media" data-reveal style={{ '--delay': '140ms' }}>
            <EditableImage fieldKey="hero.image" label="About hero image" />
          </figure>
        </div>
      </section>

      <section className="section section--aurora section--about-story">
        <div className="container split-layout">
          <AboutHeading
            eyebrowKey="who.heading.eyebrow"
            titleKey="who.heading.title"
            descriptionKey="who.heading.description"
          />
          <div className="about-story about-story--minimal" data-reveal style={{ '--delay': '120ms' }}>
            <div className="rich-copy about-story__content">
              <EditableText as="p" fieldKey="who.body.first" label="Who we are first paragraph" multiline />
              <EditableText as="p" fieldKey="who.body.second" label="Who we are second paragraph" multiline />
              <div className="about-story__pillars">
                <EditableText as="span" fieldKey="who.pillars.0" label="Who pillar 1" />
                <EditableText as="span" fieldKey="who.pillars.1" label="Who pillar 2" />
                <EditableText as="span" fieldKey="who.pillars.2" label="Who pillar 3" />
              </div>
            </div>

            <figure className="about-story__media">
              <EditableImage fieldKey="who.image" label="Who we are image" loading="lazy" />
              <figcaption className="about-story__badge">
                <EditableText as="span" fieldKey="who.badge.label" label="Who badge label" />
                <EditableText as="strong" fieldKey="who.badge.title" label="Who badge title" />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--soft section--ribbon section--about-mission">
        <div className="container card-grid card-grid--two">
          <article className="mission-card" data-reveal>
            <figure className="mission-card__media">
              <EditableImage fieldKey="mission.image" label="Mission image" loading="lazy" />
            </figure>
            <EditableText as="p" className="section-eyebrow" fieldKey="mission.label" label="Mission label" />
            <EditableText as="h3" fieldKey="mission.title" label="Mission title" multiline />
            <EditableText as="p" fieldKey="mission.description" label="Mission description" multiline />
          </article>
          <article className="mission-card" data-reveal style={{ '--delay': '120ms' }}>
            <figure className="mission-card__media">
              <EditableImage fieldKey="vision.image" label="Vision image" loading="lazy" />
            </figure>
            <EditableText as="p" className="section-eyebrow" fieldKey="vision.label" label="Vision label" />
            <EditableText as="h3" fieldKey="vision.title" label="Vision title" multiline />
            <EditableText as="p" fieldKey="vision.description" label="Vision description" multiline />
          </article>
        </div>
      </section>

      <section className="section section--mesh section--about-approach">
        <div className="container split-layout split-layout--wide">
          <div className="about-approach__intro" data-reveal>
            <AboutHeading
              eyebrowKey="approach.heading.eyebrow"
              titleKey="approach.heading.title"
              descriptionKey="approach.heading.description"
            />
            <EditableText as="p" className="section-description" fieldKey="approach.body" label="Approach body" multiline />
            <div className="about-approach__visual">
              <figure className="about-approach__media">
                <EditableImage fieldKey="approach.image" label="Approach image" loading="lazy" />
              </figure>
              <div className="about-approach__signal">
                <EditableText as="span" fieldKey="approach.signal.label" label="Approach signal label" />
                <EditableText as="strong" fieldKey="approach.signal.title" label="Approach signal title" multiline />
              </div>
              <div className="about-approach__track">
                <EditableText as="span" fieldKey="approach.track.0" label="Approach track 1" />
                <EditableText as="span" fieldKey="approach.track.1" label="Approach track 2" />
                <EditableText as="span" fieldKey="approach.track.2" label="Approach track 3" />
              </div>
            </div>
          </div>
          <div className="value-grid" data-reveal style={{ '--delay': '140ms' }}>
            {values.map((value, index) => (
              <article className="value-card" key={value.title}>
                <EditableText as="h3" fieldKey={`values.${index}.title`} label={`Value card ${index + 1} title`} />
                <EditableText as="p" fieldKey={`values.${index}.description`} label={`Value card ${index + 1} description`} multiline />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft section--halo section--about-audiences" id="who-we-serve">
        <div className="container">
          <AboutHeading
            eyebrowKey="audience.heading.eyebrow"
            titleKey="audience.heading.title"
            descriptionKey="audience.heading.description"
          />
          <div className="about-audiences__layout">
            <div className="about-audiences__canvas" data-reveal style={{ '--delay': '80ms' }}>
              <figure className="about-audiences__image about-audiences__image--main">
                <EditableImage fieldKey="audience.images.main" label="Audience main image" loading="lazy" />
              </figure>
              <figure className="about-audiences__image about-audiences__image--float">
                <EditableImage fieldKey="audience.images.float" label="Audience secondary image" loading="lazy" />
              </figure>
              <EditableText as="p" className="about-audiences__quote" fieldKey="audience.quote" label="Audience quote" multiline />
            </div>
            <div className="card-grid card-grid--audiences about-audiences__cards">
              {audiences.map((audience, index) => (
                <article
                  className="audience-card"
                  data-reveal
                  key={audience.title}
                  style={{ '--delay': `${index * 90}ms` }}
                >
                  <EditableText as="h3" fieldKey={`audience.cards.${index}.title`} label={`Audience card ${index + 1} title`} />
                  <EditableText as="p" fieldKey={`audience.cards.${index}.description`} label={`Audience card ${index + 1} description`} multiline />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--spotlight section--about-insights" id="insights">
        <div className="container about-insights">
          <div className="about-insights__head" data-reveal>
            <AboutHeading
              eyebrowKey="insight.heading.eyebrow"
              titleKey="insight.heading.title"
              descriptionKey="insight.heading.description"
            />
            <EditableText as="p" className="about-insights__lead" fieldKey="insight.lead" label="Insight lead" multiline />
          </div>
          <div className="about-insights__layout">
            <div className="about-insights__stage" data-reveal style={{ '--delay': '110ms' }}>
              <figure className="about-insights__image about-insights__image--primary">
                <EditableImage fieldKey="insight.images.primary" label="Insight primary image" loading="lazy" />
              </figure>
              <figure className="about-insights__image about-insights__image--secondary">
                <EditableImage fieldKey="insight.images.secondary" label="Insight secondary image" loading="lazy" />
              </figure>
              <div className="about-insights__quote">
                <EditableText as="span" fieldKey="insight.quote.label" label="Insight quote label" />
                <EditableText as="strong" fieldKey="insight.quote.title" label="Insight quote title" multiline />
              </div>
              <div className="about-insights__tags">
                <EditableText as="span" fieldKey="insight.tags.0" label="Insight tag 1" />
                <EditableText as="span" fieldKey="insight.tags.1" label="Insight tag 2" />
                <EditableText as="span" fieldKey="insight.tags.2" label="Insight tag 3" />
              </div>
            </div>
            <div className="about-insights__feed" data-reveal style={{ '--delay': '170ms' }}>
              {insights.map((entry, index) => (
                <article className="insight-card about-insights__item" key={entry.title}>
                  <EditableText as="span" fieldKey={`insight.cards.${index}.category`} label={`Insight card ${index + 1} category`} />
                  <EditableText as="h3" fieldKey={`insight.cards.${index}.title`} label={`Insight card ${index + 1} title`} multiline />
                  <EditableText as="p" fieldKey={`insight.cards.${index}.excerpt`} label={`Insight card ${index + 1} excerpt`} multiline />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ribbon-soft section--about-cta">
        <div className="container cta-panel" data-reveal>
          <div>
            <EditableText as="p" className="section-eyebrow" fieldKey="cta.eyebrow" label="About CTA eyebrow" />
            <EditableText as="h2" className="section-title" fieldKey="cta.title" label="About CTA title" multiline />
          </div>
          <div className="button-row">
            <EditableLink className="button button--primary" fieldKey="cta.primary" label="About CTA button" />
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

export function AboutPage({ pageId }) {
  return (
    <PageContentProvider createFallbackFields={createAboutFallbackFields} pageId="about">
      <AboutContent pageId={pageId} />
    </PageContentProvider>
  )
}
