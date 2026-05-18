import {
  imageLibrary,
  processSteps,
  serviceOfferings,
} from './siteContent.js'

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

export function createServicesFallbackFields() {
  const fields = {}

  setText(fields, 'hero.eyebrow', 'Our services')
  setText(
    fields,
    'hero.title',
    'Focused consulting, professional development, and advisory support for growth, learning, and stronger delivery.',
  )
  setText(
    fields,
    'hero.description',
    'Service details live directly inside this page so visitors can move from overview to deeper information without losing context.',
  )
  setImage(fields, 'hero.image', imageLibrary.advisory)

  setText(fields, 'overview.heading.eyebrow', 'Service overview')
  setText(fields, 'overview.heading.title', 'Support designed around real needs and practical outcomes.')
  setText(
    fields,
    'overview.heading.description',
    'Braham Licia Consulting offers services across consulting, training, and advisory support, with each service tailored to real needs and stronger execution.',
  )

  serviceOfferings.forEach((service, index) => {
    setImage(fields, `overview.cards.${index}.image`, service.image)
    setText(fields, `overview.cards.${index}.category`, service.category)
    setText(fields, `overview.cards.${index}.title`, service.title)
    setText(fields, `overview.cards.${index}.summary`, service.summary)
    setLink(fields, `overview.cards.${index}.link`, 'Open details', `#${service.anchor}`)

    setText(fields, `details.cards.${index}.category`, service.category)
    setText(fields, `details.cards.${index}.title`, service.title)
    setText(fields, `details.cards.${index}.summary`, service.summary)
    setImage(fields, `details.cards.${index}.image`, service.image)
    setText(fields, `details.cards.${index}.intro`, service.intro)
    setText(fields, `details.cards.${index}.outcomes`, service.outcomes)
    setLink(fields, `details.cards.${index}.cta`, service.ctaLabel, '/contact/#enquiry')

    service.points.forEach((point, pointIndex) => {
      setText(fields, `details.cards.${index}.points.${pointIndex}`, point)
    })
  })

  setText(fields, 'visual.heading.eyebrow', 'Visual overview')
  setText(fields, 'visual.heading.title', 'A more tangible sense of how the work shows up.')
  setText(
    fields,
    'visual.heading.description',
    'Consulting, learning, and advisory work often feels abstract on a website. These visual cues make the service experience feel more grounded and real.',
  )
  setText(fields, 'visual.delivery.label', 'Delivery model')
  setText(fields, 'visual.delivery.title', 'Strategy on the table. Action in the room. Structure in the system.')
  setText(fields, 'visual.audiences.0', 'Founders')
  setText(fields, 'visual.audiences.1', 'Teams')
  setText(fields, 'visual.audiences.2', 'Institutions')
  setImage(fields, 'visual.images.primary', imageLibrary.collaboration)
  setImage(fields, 'visual.images.secondaryTop', imageLibrary.boardroom)
  setImage(fields, 'visual.images.secondaryBottom', imageLibrary.workspace)
  setText(fields, 'visual.flow.label', 'Social alignment')
  setText(
    fields,
    'visual.flow.title',
    'People, teams, and institutions moving in one practical delivery rhythm.',
  )
  setText(fields, 'visual.flow.track.0', 'Connect')
  setText(fields, 'visual.flow.track.1', 'Coordinate')
  setText(fields, 'visual.flow.track.2', 'Execute')

  setText(fields, 'details.heading.eyebrow', 'Service details')
  setText(fields, 'details.heading.title', 'Detailed pathways inside a single guided services experience.')
  setText(
    fields,
    'details.heading.description',
    'Each dropdown below expands to show scope, focus areas, expected outcomes, and the next best call to action.',
  )
  setText(fields, 'details.labels.overview', 'Overview')
  setText(fields, 'details.labels.includes', 'What this can include')
  setText(fields, 'details.labels.gain', 'What clients gain')

  setText(fields, 'process.heading.eyebrow', 'How engagements work')
  setText(fields, 'process.heading.title', 'A structured delivery rhythm that stays flexible to your context.')

  processSteps.forEach((step, index) => {
    setText(fields, `process.steps.${index}.number`, step.number)
    setText(fields, `process.steps.${index}.title`, step.title)
    setText(fields, `process.steps.${index}.description`, step.description)
  })

  setText(fields, 'cta.eyebrow', 'Need support that matches your goals?')
  setText(
    fields,
    'cta.title',
    'We can help you identify the right service path based on your needs, current stage, and desired outcomes.',
  )
  setLink(fields, 'cta.primary', 'Book a Consultation', '/contact/#enquiry')
  setLink(fields, 'cta.secondary', 'Contact Us', '/contact/')

  return fields
}
