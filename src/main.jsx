import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/site.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found.')
}

const pageId = rootElement.dataset.page ?? 'home'
const app = (
  <StrictMode>
    <App pageId={pageId} />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
