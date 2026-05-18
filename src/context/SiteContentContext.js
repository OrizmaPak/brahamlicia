import { createContext } from 'react'
import { createSiteContent } from '../content/defaultContent.js'

export const SiteContentContext = createContext(createSiteContent())
