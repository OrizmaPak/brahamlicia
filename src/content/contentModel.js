export const editableSections = [
  {
    collectionName: 'services',
    contentKey: 'serviceOfferings',
    label: 'Services',
    singularLabel: 'Service',
  },
  {
    collectionName: 'testimonials',
    contentKey: 'testimonials',
    label: 'Testimonials',
    singularLabel: 'Testimonial',
  },
  {
    collectionName: 'faqs',
    contentKey: 'faqItems',
    label: 'FAQs',
    singularLabel: 'FAQ',
  },
  {
    collectionName: 'audiences',
    contentKey: 'audiences',
    label: 'Audiences',
    singularLabel: 'Audience',
  },
  {
    collectionName: 'insights',
    contentKey: 'insights',
    label: 'Insights',
    singularLabel: 'Insight',
  },
]

export const singletonSections = [
  {
    collectionName: 'imageLibrary',
    contentKey: 'imageLibrary',
    label: 'Image Library',
    type: 'images',
  },
  {
    collectionName: 'heroMoments',
    contentKey: 'heroMoments',
    label: 'Hero Moments',
    type: 'json',
  },
  {
    collectionName: 'homeHighlights',
    contentKey: 'homeHighlights',
    label: 'Home Highlights',
    type: 'json',
  },
  {
    collectionName: 'processSteps',
    contentKey: 'processSteps',
    label: 'Process Steps',
    type: 'json',
  },
  {
    collectionName: 'values',
    contentKey: 'values',
    label: 'Values',
    type: 'json',
  },
  {
    collectionName: 'whyChooseUs',
    contentKey: 'whyChooseUs',
    label: 'Why Choose Us',
    type: 'json',
  },
  {
    collectionName: 'primaryNavigation',
    contentKey: 'primaryNavigation',
    label: 'Primary Navigation',
    type: 'json',
  },
  {
    collectionName: 'aboutMenuItems',
    contentKey: 'aboutMenuItems',
    label: 'About Menu',
    type: 'json',
  },
  {
    collectionName: 'footerLinks',
    contentKey: 'footerLinks',
    label: 'Footer Links',
    type: 'json',
  },
  {
    collectionName: 'pageDefinitions',
    contentKey: 'pageDefinitions',
    label: 'Page Definitions',
    type: 'json',
  },
]

export function collectImageAssets(content) {
  const found = new Map()

  function visit(value, path = []) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...path, index]))
      return
    }

    if (!value || typeof value !== 'object') return

    if (typeof value.src === 'string' && value.src.trim()) {
      const src = value.src.trim()
      if (!found.has(src)) {
        found.set(src, {
          alt: typeof value.alt === 'string' ? value.alt : '',
          sourcePath: path.join('.'),
          src,
        })
      }
    }

    Object.entries(value).forEach(([key, entry]) => visit(entry, [...path, key]))
  }

  visit(content)
  return Array.from(found.values())
}
