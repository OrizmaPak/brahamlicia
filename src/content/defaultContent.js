import {
  aboutMenuItems,
  audiences,
  faqItems,
  footerLinks,
  heroMoments,
  homeHighlights,
  imageLibrary,
  insights,
  pageDefinitions,
  primaryNavigation,
  processSteps,
  serviceOfferings,
  servicesMenuItems,
  siteConfig,
  testimonials,
  values,
  whyChooseUs,
} from './siteContent.js'

export const defaultSiteContent = {
  aboutMenuItems,
  audiences,
  faqItems,
  footerLinks,
  heroMoments,
  homeHighlights,
  imageLibrary,
  insights,
  pageDefinitions,
  primaryNavigation,
  processSteps,
  serviceOfferings,
  servicesMenuItems,
  siteConfig,
  testimonials,
  values,
  whyChooseUs,
}

export function createSiteContent(overrides = {}) {
  const serviceOfferingsOverride = overrides.serviceOfferings ?? defaultSiteContent.serviceOfferings
  const siteConfigOverride = {
    ...defaultSiteContent.siteConfig,
    ...(overrides.siteConfig ?? {}),
  }

  return {
    ...defaultSiteContent,
    ...overrides,
    serviceOfferings: serviceOfferingsOverride,
    servicesMenuItems: [
      { href: '/services/', label: 'Service Overview' },
      ...serviceOfferingsOverride.map((service) => ({
        href: `/services/#${service.anchor}`,
        label: service.title,
      })),
    ],
    siteConfig: siteConfigOverride,
  }
}
