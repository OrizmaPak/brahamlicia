/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createHomeFallbackFields } from '../content/homeContentFields.js'
import { isFirebaseConfigured } from '../lib/firebase.js'
import { subscribeHomeContent } from '../lib/homeContentRepository.js'

const HomeContentContext = createContext(null)

export function HomeContentProvider({ children }) {
  const [fallbackFields] = useState(() => createHomeFallbackFields())
  const [remoteFields, setRemoteFields] = useState({})
  const [source, setSource] = useState('fallback')
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeHomeContent(
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
  }, [])

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
      source,
    }),
    [error, fallbackFields, fields, isLoading, source],
  )

  return <HomeContentContext.Provider value={value}>{children}</HomeContentContext.Provider>
}

export function useHomeContent() {
  const context = useContext(HomeContentContext)
  if (!context) {
    throw new Error('useHomeContent must be used inside HomeContentProvider.')
  }
  return context
}

export function useHomeField(fieldKey) {
  const { fields } = useHomeContent()
  return fields[fieldKey]
}

