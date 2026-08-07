import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

// Each locale is its own prerendered HTML file; <html lang> is the only thing
// distinguishing them at runtime, so read the locale back from there rather
// than duplicating an entry point per language.
const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
)

// The production build ships prerendered markup, so attach to it rather than
// throwing it away. Dev (and any future empty shell) still mounts normally.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
