import {
  audiences,
  faqItems,
  heroMoments,
  homeHighlights,
  imageLibrary,
  insights,
  processSteps,
  serviceOfferings,
} from './siteContent.js'

export const homeWhyCards = [
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

export function createHomeFallbackFields() {
  const fields = {}

  setText(fields, 'hero.eyebrow', 'Independent consulting brand')
  setText(fields, 'hero.title.main', 'Clarity and structure for')
  setText(fields, 'hero.title.accent', ' teams in motion.')
  setText(
    fields,
    'hero.description',
    'Strategic clarity and cleaner execution for businesses, institutions, and leaders.',
  )
  setLink(fields, 'hero.cta.primary', 'Book a Consultation', '/contact/#enquiry')
  setLink(fields, 'hero.cta.secondary', 'Explore Our Services', '/services/')

  homeHighlights.forEach((item, index) => {
    setText(fields, `hero.highlights.${index}.label`, item)
  })

  heroMoments.forEach((moment, index) => {
    setText(fields, `hero.moments.${index}.label`, moment.label)
    setText(fields, `hero.moments.${index}.title`, moment.title)
    setText(fields, `hero.moments.${index}.categoryLabel`, moment.categoryLabel)
    setText(fields, `hero.moments.${index}.categoryTitle`, moment.categoryTitle)
    setText(fields, `hero.moments.${index}.panelNote`, moment.panelNote)
    setText(fields, `hero.moments.${index}.feeling`, moment.feeling)
    setText(fields, `hero.moments.${index}.imageCaption`, moment.imageCaption)
    setImage(fields, `hero.moments.${index}.image`, moment.image)
    moment.points.forEach((point, pointIndex) => {
      setText(fields, `hero.moments.${index}.points.${pointIndex}`, point)
    })
  })

  setText(fields, 'story.heading.eyebrow', 'A consulting brand built for progress')
  setText(fields, 'story.heading.title', 'Intentional growth. Practical execution. Better control.')
  setText(
    fields,
    'story.heading.description',
    'We help organisations, teams, and professionals strengthen direction, improve performance, and build systems that support sustainable results.',
  )
  setImage(fields, 'story.images.primary', imageLibrary.strategy)
  setImage(fields, 'story.images.floating', imageLibrary.collaboration)
  setText(fields, 'story.signal.label', 'Operating mode')
  setText(fields, 'story.signal.title', 'Quiet authority.')
  setText(
    fields,
    'story.body',
    'Our approach combines strategic thinking with practical implementation. That means we do not stop at ideas. We help shape them into action, structure, and measurable progress.',
  )

  ;[
    ['Clarity first', 'Define the path before pushing for speed.'],
    ['Build clean systems', 'Reduce friction with better working structure.'],
    ['Hold the gain', 'Turn improvement into a lasting operating rhythm.'],
  ].forEach(([title, description], index) => {
    setText(fields, `story.tracks.${index}.title`, title)
    setText(fields, `story.tracks.${index}.description`, description)
  })

  setText(fields, 'story.footer.label', 'Operating stance')
  setText(fields, 'story.footer.title', 'Quiet confidence. Sharp structure. Clear decisions.')
  setLink(fields, 'story.footer.link', 'Learn more about the consulting approach', '/about/')

  setText(fields, 'servicesPreview.heading.eyebrow', 'What we do')
  setText(
    fields,
    'servicesPreview.heading.title',
    'Focused support across consulting, learning, and advisory.',
  )
  setText(
    fields,
    'servicesPreview.heading.description',
    'Three service lines designed for clear decisions, stronger execution, and durable results.',
  )
  serviceOfferings.forEach((service, index) => {
    setText(fields, `servicesPreview.cards.${index}.category`, service.category)
    setText(fields, `servicesPreview.cards.${index}.title`, service.title)
    setText(fields, `servicesPreview.cards.${index}.summary`, service.summary)
    setImage(fields, `servicesPreview.cards.${index}.image`, service.image)
    setLink(fields, `servicesPreview.cards.${index}.link`, 'Explore service', `/services/#${service.anchor}`)
    service.points.slice(0, 2).forEach((point, pointIndex) => {
      setText(fields, `servicesPreview.cards.${index}.points.${pointIndex}`, point)
    })
  })

  setText(fields, 'why.heading.eyebrow', 'Why Braham Licia Consulting')
  setText(fields, 'why.heading.title', 'A calm, strategic partner with financial-grade discipline.')
  setText(
    fields,
    'why.heading.description',
    'We combine clarity, professionalism, and practical thinking to help clients move from challenge to progress.',
  )
  homeWhyCards.forEach((card, index) => {
    setText(fields, `why.cards.${index}.eyebrow`, card.eyebrow)
    setText(fields, `why.cards.${index}.title`, card.title)
    setText(fields, `why.cards.${index}.description`, card.description)
  })
  setImage(fields, 'why.images.main', imageLibrary.leadership)
  setImage(fields, 'why.images.accent', imageLibrary.boardroom)
  setText(fields, 'why.note.label', 'Client experience')
  setText(fields, 'why.note.title', 'Measured thinking with visible operational control.')

  setText(fields, 'process.heading.eyebrow', 'How we work')
  setText(fields, 'process.heading.title', 'A simple, structured pathway from discovery to stronger delivery.')
  processSteps.forEach((step, index) => {
    setText(fields, `process.steps.${index}.number`, step.number)
    setText(fields, `process.steps.${index}.title`, step.title)
    setText(fields, `process.steps.${index}.description`, step.description)
  })

  setImage(fields, 'audiencePreview.image', imageLibrary.collaboration)
  setText(fields, 'audiencePreview.heading.eyebrow', 'Who we serve')
  setText(
    fields,
    'audiencePreview.heading.title',
    'Designed for organisations, teams, and professionals committed to intentional growth.',
  )
  setText(
    fields,
    'audiencePreview.heading.description',
    'The About page carries the full audience fit, thought leadership, and brand story so visitors can understand relevance quickly.',
  )
  audiences.slice(0, 3).forEach((audience, index) => {
    setText(fields, `audiencePreview.items.${index}.title`, audience.title)
    setText(fields, `audiencePreview.items.${index}.description`, audience.description)
  })
  setLink(fields, 'audiencePreview.link', 'See who we serve', '/about/#who-we-serve')

  setImage(fields, 'insightsPreview.image', imageLibrary.insightDesk)
  setText(fields, 'insightsPreview.heading.eyebrow', 'Insights')
  setText(fields, 'insightsPreview.heading.title', 'Ideas for growth and better decision-making.')
  setText(
    fields,
    'insightsPreview.heading.description',
    'We surface reflections on leadership, systems, professional development, and organisational effectiveness inside the About experience.',
  )
  insights.forEach((entry, index) => {
    setText(fields, `insightsPreview.items.${index}.category`, entry.category)
    setText(fields, `insightsPreview.items.${index}.title`, entry.title)
    setText(fields, `insightsPreview.items.${index}.excerpt`, entry.excerpt)
  })
  setLink(fields, 'insightsPreview.link', 'Visit insights', '/about/#insights')

  setText(fields, 'faqPreview.heading.eyebrow', 'Frequently asked questions')
  setText(fields, 'faqPreview.heading.title', 'Quick clarity before we start working together.')
  setText(
    fields,
    'faqPreview.heading.description',
    'Clear answers on fit, delivery format, service customisation, and how to choose the right engagement path.',
  )
  setText(
    fields,
    'faqPreview.intro',
    'You do not need to fully map the whole engagement before reaching out. A short conversation helps define the most practical next step.',
  )
  setImage(fields, 'faqPreview.image', imageLibrary.leadership)
  faqItems.forEach((item, index) => {
    setText(fields, `faqPreview.items.${index}.question`, item.question)
    setText(fields, `faqPreview.items.${index}.answer`, item.answer)
  })

  setText(fields, 'cta.eyebrow', 'Ready to build with more clarity and confidence?')
  setText(fields, 'cta.title', 'Consulting, training, and guidance for forward movement.')
  setText(fields, 'cta.description', 'Structured support to help your team move with clarity and purpose.')
  setLink(fields, 'cta.primary', 'Book a Consultation', '/contact/#enquiry')
  setLink(fields, 'cta.secondary', 'Send an Enquiry', '/contact/#enquiry')

  return fields
}

export function getTextField(fields, key) {
  return fields[key]?.value ?? ''
}

export function getLinkField(fields, key) {
  const field = fields[key]
  return {
    href: field?.href ?? '#',
    label: field?.label ?? '',
    type: 'link',
  }
}

export function getImageField(fields, key) {
  const field = fields[key]
  return {
    alt: field?.alt ?? '',
    src: field?.src ?? '',
    type: 'image',
  }
}
