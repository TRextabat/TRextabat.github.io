import { renderToString } from 'react-dom/server'
import App from './App'

// Build-time only. Produces the static markup injected into each locale's
// index.html so crawlers that never execute JavaScript (GPTBot, ClaudeBot,
// PerplexityBot, and Bing's non-render pass) receive the full page instead of
// an empty root.
export function render(lang = 'en') {
  return renderToString(<App lang={lang} />)
}
