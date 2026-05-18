import { imageLibrary, siteConfig } from './siteContent.js'

const text = (value) => ({ type: 'text', value })
const link = (label, href) => ({ type: 'link', href, label })
const image = ({ alt, src }) => ({ type: 'image', alt, src })

function setText(fields, key, value) {
  fields[key] = text(value)
}

function setLink(fields, key, label, href) {
  fields[key] = link(label, href)
}

function setImage(fields, key, value) {
  fields[key] = image(value)
}

export function createContactFallbackFields() {
  const fields = {}

  setText(fields, 'hero.eyebrow', 'Contact us')
  setText(
    fields,
    'hero.title',
    "Let's talk about how Braham Licia Consulting can support your growth, learning, or next initiative.",
  )
  setText(
    fields,
    'hero.description',
    'Whether you need consulting support, a training engagement, project advisory, or simply want to explore possibilities, we would be glad to hear from you.',
  )
  setImage(fields, 'hero.image', imageLibrary.office)

  setText(fields, 'form.heading.eyebrow', 'Send an enquiry')
  setText(fields, 'form.heading.title', 'Tell us a little about your needs.')
  setText(
    fields,
    'form.heading.description',
    'Use the form below to share your goals, service interest, and preferred next step.',
  )
  setImage(fields, 'form.visual.image', imageLibrary.collaboration)
  setText(fields, 'form.visual.label', 'First contact')
  setText(fields, 'form.visual.title', 'Clear brief. Calm review. Structured next move.')

  setText(fields, 'details.heading', 'Contact details')
  setText(fields, 'details.labels.email', 'Email')
  setLink(fields, 'details.values.email', siteConfig.primaryEmail, `mailto:${siteConfig.primaryEmail}`)
  setText(fields, 'details.labels.support', 'Support')
  setLink(fields, 'details.values.support', siteConfig.secondaryEmail, `mailto:${siteConfig.secondaryEmail}`)
  setText(fields, 'details.labels.phone', 'Phone')
  setLink(fields, 'details.values.phone', siteConfig.primaryPhone, 'tel:+2348143701179')
  setText(fields, 'details.labels.altPhone', 'Alternate line')
  setLink(fields, 'details.values.altPhone', siteConfig.secondaryPhone, 'tel:+2348143866334')
  setText(fields, 'details.labels.location', 'Location')
  setText(fields, 'details.values.location', siteConfig.location)
  setText(fields, 'details.labels.hours', 'Business hours')
  setText(fields, 'details.values.hours', siteConfig.hours)

  setImage(fields, 'details.images.primary', imageLibrary.training)
  setImage(fields, 'details.images.secondary', imageLibrary.boardroom)
  setText(fields, 'details.next.label', 'Next step')
  setText(fields, 'details.next.title', 'Tell us the brief. We shape the path.')

  setText(fields, 'cta.eyebrow', 'Ready to take the next step?')
  setText(
    fields,
    'cta.title',
    "Book a consultation or send an enquiry and let's explore how we can work together.",
  )
  setLink(fields, 'cta.primary', 'Book a Consultation', '/contact/#enquiry')
  setLink(fields, 'cta.secondary', 'Email Us', `mailto:${siteConfig.primaryEmail}`)

  return fields
}
