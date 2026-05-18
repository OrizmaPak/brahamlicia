import React, { useEffect, useMemo, useState } from 'react'
import { createSiteContent } from '../content/defaultContent.js'
import { subscribeToPublishedContent } from '../lib/contentRepository.js'
import { isFirebaseConfigured } from '../lib/firebase.js'
import { SiteContentContext } from './SiteContentContext.js'

export function ContentProvider({ children }) {
  const [remoteContent, setRemoteContent] = useState({})

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined') return undefined

    return subscribeToPublishedContent(
      (content) => setRemoteContent(content),
      (error) => {
        console.error('Unable to load Firebase content.', error)
      },
    )
  }, [])

  const value = useMemo(() => createSiteContent(remoteContent), [remoteContent])

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}
