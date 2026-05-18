import { footerLinks, siteConfig } from './siteContent.js'

const text = (value) => ({ type: 'text', value })
const link = (label, href) => ({ type: 'link', href, label })

function setText(fields, key, value) {
  fields[key] = text(value)
}

function setLink(fields, key, label, href) {
  fields[key] = link(label, href)
}

export function createFooterFallbackFields() {
  const fields = {}

  setText(fields, 'brand.name', siteConfig.name)
  setText(fields, 'brand.tagline', siteConfig.tagline)

  setText(fields, 'explore.heading', 'Explore')
  footerLinks.forEach((item, index) => {
    setLink(fields, `explore.links.${index}`, item.label, item.href)
  })

  setText(fields, 'contact.heading', 'Contact')
  setLink(fields, 'contact.email.primary', siteConfig.primaryEmail, `mailto:${siteConfig.primaryEmail}`)
  setLink(fields, 'contact.email.secondary', siteConfig.secondaryEmail, `mailto:${siteConfig.secondaryEmail}`)
  setLink(fields, 'contact.phone.primary', siteConfig.primaryPhone, 'tel:+2348143701179')
  setLink(fields, 'contact.phone.secondary', siteConfig.secondaryPhone, 'tel:+2348143866334')
  setText(fields, 'contact.location', siteConfig.location)
  setText(fields, 'contact.hours', siteConfig.hours)

  setText(fields, 'bottom.copyright', 'Copyright Braham Licia Consulting. All rights reserved.')
  setText(fields, 'bottom.note', 'Built for clarity, growth, and practical direction.')

  return fields
}
