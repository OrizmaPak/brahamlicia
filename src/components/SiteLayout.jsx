import React from 'react'
import { useEffect, useState } from 'react'
import brandLogo from '../assets/braham logo new.png'
import {
  aboutMenuItems,
  footerLinks,
  primaryNavigation,
  servicesMenuItems,
  siteConfig,
} from '../content/siteContent.js'

function BrandMark() {
  return (
    <span aria-hidden="true" className="brand-mark">
      <img alt="" className="brand-mark__image" src={brandLogo} />
    </span>
  )
}

function DesktopDropdown({ href, isActive, items, label }) {
  return (
    <div className="nav-dropdown">
      <a className={`nav-link${isActive ? ' is-active' : ''}`} href={href}>
        {label}
        <span className="nav-link__caret" />
      </a>
      <div className="dropdown-panel">
        {items.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function MobileGroup({ id, isOpen, items, label, onToggle }) {
  return (
    <div className="mobile-menu__group">
      <button
        aria-expanded={isOpen}
        className="mobile-menu__group-button"
        onClick={() => onToggle(isOpen ? null : id)}
        type="button"
      >
        <span>{label}</span>
        <span aria-hidden="true" className="nav-link__caret" />
      </button>
      <div className={`mobile-menu__group-panel${isOpen ? ' is-open' : ''}`}>
        {items.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function SiteLayout({ children, pageId }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMobileGroup, setActiveMobileGroup] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    )

    const revealItems = document.querySelectorAll('[data-reveal]')
    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollToHashTarget = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return

      const target = document.getElementById(hash)
      if (!target) return

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }

    scrollToHashTarget()
    window.addEventListener('hashchange', scrollToHashTarget)

    return () => window.removeEventListener('hashchange', scrollToHashTarget)
  }, [pageId])

  return (
    <div className={`site-shell site-shell--${pageId}`}>
      <header className="site-header">
        <div className="container site-header__inner">
          <a aria-label={`${siteConfig.name} home`} className="brand" href="/">
            <BrandMark />
          </a>

          <nav aria-label="Primary navigation" className="desktop-nav">
            {primaryNavigation.map((item) => {
              if (item.id === 'about') {
                return (
                  <DesktopDropdown
                    href={item.href}
                    isActive={pageId === item.id}
                    items={aboutMenuItems}
                    key={item.id}
                    label={item.label}
                  />
                )
              }

              if (item.id === 'services') {
                return (
                  <DesktopDropdown
                    href={item.href}
                    isActive={pageId === item.id}
                    items={servicesMenuItems}
                    key={item.id}
                    label={item.label}
                  />
                )
              }

              return (
                <a
                  className={`nav-link${pageId === item.id ? ' is-active' : ''}`}
                  href={item.href}
                  key={item.id}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="site-header__actions">
            <a className="button button--primary desktop-cta" href="/contact/#enquiry">
              Book a Consultation
            </a>
            <button
              aria-expanded={isMobileMenuOpen}
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              type="button"
            >
              Menu
            </button>
          </div>
        </div>

        <div className={`mobile-menu${isMobileMenuOpen ? ' is-open' : ''}`}>
          <div className="container mobile-menu__inner">
            {primaryNavigation.map((item) => {
              if (item.id === 'about') {
                return (
                  <MobileGroup
                    id="about"
                    isOpen={activeMobileGroup === 'about'}
                    items={aboutMenuItems}
                    key={item.id}
                    label={item.label}
                    onToggle={setActiveMobileGroup}
                  />
                )
              }

              if (item.id === 'services') {
                return (
                  <MobileGroup
                    id="services"
                    isOpen={activeMobileGroup === 'services'}
                    items={servicesMenuItems}
                    key={item.id}
                    label={item.label}
                    onToggle={setActiveMobileGroup}
                  />
                )
              }

              return (
                <a className="mobile-menu__link" href={item.href} key={item.id}>
                  {item.label}
                </a>
              )
            })}
            <a className="button button--primary mobile-menu__cta" href="/contact/#enquiry">
              Book a Consultation
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="footer-brand">
            <div className="footer-brand__lockup">
              <BrandMark />
              <div>
                <strong>{siteConfig.name}</strong>
                <p>{siteConfig.tagline}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="footer-heading">Explore</p>
            <div className="footer-links">
              {footerLinks.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-heading">Contact</p>
            <div className="footer-links footer-links--contact">
              <a href={`mailto:${siteConfig.primaryEmail}`}>{siteConfig.primaryEmail}</a>
              <a href={`mailto:${siteConfig.secondaryEmail}`}>{siteConfig.secondaryEmail}</a>
              <a href="tel:+2348143701179">{siteConfig.primaryPhone}</a>
              <a href="tel:+2348143866334">{siteConfig.secondaryPhone}</a>
              <span>{siteConfig.location}</span>
              <span>{siteConfig.hours}</span>
            </div>
          </div>
        </div>

        <div className="container site-footer__bottom">
          <span>Copyright Braham Licia Consulting. All rights reserved.</span>
          <span>Built for clarity, growth, and practical direction.</span>
        </div>
      </footer>
    </div>
  )
}
