import React, { useEffect, useMemo, useState } from 'react'
import { createSiteContent } from '../content/defaultContent.js'
import { subscribeToPublishedContent } from '../lib/contentRepository.js'
import { isFirebaseConfigured } from '../lib/firebase.js'
import { SiteContentContext } from './SiteContentContext.js'

export function ContentProvider({ children }) {
  const [remoteContent, setRemoteContent] = useState({})
  const [contentStatus, setContentStatus] = useState({
    error: null,
    isLoading: isFirebaseConfigured,
    source: isFirebaseConfigured ? 'firestore' : 'fallback',
  })

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined') return undefined

    const fallbackTimer = window.setTimeout(() => {
      setContentStatus((current) => ({
        ...current,
        isLoading: false,
        source: 'fallback',
      }))
    }, 3500)

    const unsubscribe = subscribeToPublishedContent(
      (content) => setRemoteContent(content),
      (error) => {
        console.error('Unable to load Firebase content.', error)
        setContentStatus({
          error,
          isLoading: false,
          source: 'fallback',
        })
      },
      () => {
        window.clearTimeout(fallbackTimer)
        setContentStatus({
          error: null,
          isLoading: false,
          source: 'firestore',
        })
      },
    )

    return () => {
      window.clearTimeout(fallbackTimer)
      unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => createSiteContent(remoteContent, contentStatus),
    [contentStatus, remoteContent],
  )

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}
