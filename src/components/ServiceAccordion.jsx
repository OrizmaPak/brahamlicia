import React from 'react'
import { useEffect } from 'react'

export function ServiceAccordion({ services }) {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return

    const target = document.getElementById(hash)
    if (target instanceof HTMLDetailsElement) {
      target.open = true
    }
  }, [])

  return (
    <div className="service-accordion">
      {services.map((service, index) => (
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
              <span className="service-detail__pill">{service.category}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </div>
            <span aria-hidden="true" className="service-detail__toggle" />
          </summary>
          <div className="service-detail__body">
            <div className="service-detail__grid">
              <figure className="service-detail__media">
                <img alt={service.image.alt} loading="lazy" src={service.image.src} />
              </figure>
              <div className="service-detail__content">
                <div>
                  <p className="service-detail__label">Overview</p>
                  <p>{service.intro}</p>
                </div>
                <div>
                  <p className="service-detail__label">What this can include</p>
                  <ul className="detail-list">
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="service-detail__label">What clients gain</p>
                  <p>{service.outcomes}</p>
                </div>
                <a className="text-link" href="/contact/#enquiry">
                  {service.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
