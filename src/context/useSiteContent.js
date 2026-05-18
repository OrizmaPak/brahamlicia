import { useContext } from 'react'
import { SiteContentContext } from './SiteContentContext.js'

export function useSiteContent() {
  return useContext(SiteContentContext)
}
