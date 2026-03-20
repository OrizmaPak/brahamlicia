import React from 'react'

export function SectionHeading({ align = 'left', eyebrow, title, description }) {
  return (
    <div className={`section-heading section-heading--${align}`} data-reveal>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  )
}
