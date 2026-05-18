import React from 'react'

export function SkeletonBlock({ className = '', lines = 3 }) {
  return (
    <div className={`content-skeleton ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 3, variant = 'card' }) {
  return (
    <div className={`skeleton-grid skeleton-grid--${variant}`} aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock key={index} lines={variant === 'faq' ? 2 : 4} />
      ))}
    </div>
  )
}
