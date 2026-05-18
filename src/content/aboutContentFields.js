import {
  audiences,
  imageLibrary,
  insights,
  values,
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

export function createAboutFallbackFields() {
  const fields = {}

  setText(fields, 'hero.eyebrow', 'About Braham Licia Consulting')
  setText(
    fields,
    'hero.title',
    'A modern consulting brand helping people, teams, and organisations move from complexity to clarity.',
  )
  setText(
    fields,
    'hero.description',
    'Our consulting approach is rooted in intentional growth, practical structure, human-centred thinking, and confidence-building support for stronger results.',
  )
  setImage(fields, 'hero.image', imageLibrary.about)

  setText(fields, 'who.heading.eyebrow', 'Who we are')
  setText(fields, 'who.heading.title', 'Thoughtful consulting for intentional growth.')
  setText(
    fields,
    'who.heading.description',
    'Braham Licia Consulting is a consulting and professional development brand committed to helping businesses, institutions, and professionals grow with intention.',
  )
  setText(
    fields,
    'who.body.first',
    'We provide advisory support, learning interventions, and strategic guidance that improve clarity, strengthen systems, and support meaningful outcomes.',
  )
  setText(
    fields,
    'who.body.second',
    'Our approach is human-centred and practical, helping clients translate goals into realistic plans and visible progress with stronger internal alignment.',
  )
  setText(fields, 'who.pillars.0', 'Clarity-led strategy')
  setText(fields, 'who.pillars.1', 'Human-centred execution')
  setText(fields, 'who.pillars.2', 'Sustainable capability')
  setImage(fields, 'who.image', imageLibrary.collaboration)
  setText(fields, 'who.badge.label', 'Consulting rhythm')
  setText(fields, 'who.badge.title', 'Listen, align, and execute with control.')

  setImage(fields, 'mission.image', imageLibrary.workspace)
  setText(fields, 'mission.label', 'Our mission')
  setText(fields, 'mission.title', 'To help people and organisations grow with clarity, competence, and impact.')
  setText(
    fields,
    'mission.description',
    'We provide thoughtful consulting, professional development, and strategic support that turns goals into practical progress.',
  )

  setImage(fields, 'vision.image', imageLibrary.office)
  setText(fields, 'vision.label', 'Our vision')
  setText(fields, 'vision.title', 'To be a trusted consulting brand known for stronger systems and meaningful progress.')
  setText(
    fields,
    'vision.description',
    'We want to be recognised for helping clients build better leadership, stronger delivery, and more confident growth pathways.',
  )

  setText(fields, 'approach.heading.eyebrow', 'Our approach')
  setText(fields, 'approach.heading.title', 'Clear, collaborative, practical.')
  setText(
    fields,
    'approach.heading.description',
    'We listen deeply, understand context, and shape solutions that are relevant, realistic, and sustainable.',
  )
  setText(
    fields,
    'approach.body',
    'We do not believe in one-size-fits-all recommendations. Every business, institution, and team has its own realities. That is why our consulting process is built around context, people, and practical implementation.',
  )
  setImage(fields, 'approach.image', imageLibrary.leadership)
  setText(fields, 'approach.signal.label', 'Delivery mindset')
  setText(fields, 'approach.signal.title', 'Context-first strategy with practical implementation discipline.')
  setText(fields, 'approach.track.0', 'Context')
  setText(fields, 'approach.track.1', 'Collaboration')
  setText(fields, 'approach.track.2', 'Execution')

  values.forEach((value, index) => {
    setText(fields, `values.${index}.title`, value.title)
    setText(fields, `values.${index}.description`, value.description)
  })

  setText(fields, 'audience.heading.eyebrow', 'Who we serve')
  setText(
    fields,
    'audience.heading.title',
    'Built for organisations, teams, professionals, and leaders who want to grow well.',
  )
  setText(
    fields,
    'audience.heading.description',
    'We support a range of audiences, but the common need is the same: clearer direction, stronger systems, more effective people, and better delivery.',
  )
  setImage(fields, 'audience.images.main', imageLibrary.boardroom)
  setImage(fields, 'audience.images.float', imageLibrary.training)
  setText(fields, 'audience.quote', 'Growth becomes meaningful when people, systems, and purpose move in alignment.')

  audiences.forEach((audience, index) => {
    setText(fields, `audience.cards.${index}.title`, audience.title)
    setText(fields, `audience.cards.${index}.description`, audience.description)
  })

  setText(fields, 'insight.heading.eyebrow', 'Insights')
  setText(fields, 'insight.heading.title', 'Thought leadership that supports better decisions.')
  setText(
    fields,
    'insight.heading.description',
    'Leading consulting brands make space for their thinking, not only their services. Here the About page carries a visible insight layer so the brand reads as thoughtful, not transactional.',
  )
  setText(
    fields,
    'insight.lead',
    'This layer positions the brand as a thinking partner, where insights are designed to sharpen choices, not just fill space.',
  )
  setImage(fields, 'insight.images.primary', imageLibrary.strategy)
  setImage(fields, 'insight.images.secondary', imageLibrary.insightDesk)
  setText(fields, 'insight.quote.label', 'Thinking layer')
  setText(fields, 'insight.quote.title', 'Structure insight into decisions people can execute.')
  setText(fields, 'insight.tags.0', 'Leadership')
  setText(fields, 'insight.tags.1', 'Systems')
  setText(fields, 'insight.tags.2', 'Capability')

  insights.forEach((entry, index) => {
    setText(fields, `insight.cards.${index}.category`, entry.category)
    setText(fields, `insight.cards.${index}.title`, entry.title)
    setText(fields, `insight.cards.${index}.excerpt`, entry.excerpt)
  })

  setText(fields, 'cta.eyebrow', "Let's move your work forward")
  setText(
    fields,
    'cta.title',
    'Stronger structure, clearer thinking, and more confident progress start with a focused conversation.',
  )
  setLink(fields, 'cta.primary', 'Work With Us', '/contact/#enquiry')

  return fields
}
