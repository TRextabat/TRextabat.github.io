import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships prerendered markup, so attach to it rather than
// throwing it away. Dev (and any future empty shell) still mounts normally.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
