/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from '../lib/firebase.js'
import { subscribePageContent } from '../lib/homeContentRepository.js'

const PageContentContext = createContext(null)

export function PageContentProvider({ children, createFallbackFields, pageId }) {
  const [fallbackFields] = useState(() => createFallbackFields())
  const [remoteFields, setRemoteFields] = useState({})
  const [source, setSource] = useState('fallback')
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribePageContent(
      pageId,
      ({ fields, source: nextSource }) => {
        setRemoteFields(fields ?? {})
        setSource(nextSource)
        setIsLoading(false)
      },
      (contentError) => {
        setError(contentError.message)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [pageId])

  const fields = useMemo(
    () => ({
      ...fallbackFields,
      ...remoteFields,
    }),
    [fallbackFields, remoteFields],
  )

  const value = useMemo(
    () => ({
      error,
      fallbackFields,
      fields,
      isLoading,
      pageId,
      source,
    }),
    [error, fallbackFields, fields, isLoading, pageId, source],
  )

  return <PageContentContext.Provider value={value}>{children}</PageContentContext.Provider>
}

export function usePageContent() {
  const context = useContext(PageContentContext)
  if (!context) {
    throw new Error('usePageContent must be used inside PageContentProvider.')
  }
  return context
}

export function usePageField(fieldKey) {
  const { fields } = usePageContent()
  return fields[fieldKey]
}
