// Renders scripts/og-template.html to public/og-image.png at 1200x630.
// Not part of `npm run build` — it needs a headless browser and the image only
// changes when the template does. Run manually: node scripts/generate-og.mjs
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

let puppeteer
try {
  puppeteer = require('puppeteer')
} catch {
  puppeteer = (await import(`${process.env.GLOBAL_MODULES}/puppeteer/lib/esm/puppeteer/puppeteer.js`)).default
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
})
const page = await browser.newPage()
// Exactly 1200x630 — the size every platform crops against, and small enough
// that WhatsApp/Slack actually fetch the preview instead of skipping it.
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(resolve(root, 'scripts/og-template.html')).href, {
  waitUntil: 'networkidle0',
})
// Webfonts arrive after networkidle in some runs; block until they're usable
// or the card renders in Impact/Arial and looks nothing like the brand.
await page.evaluate(() => document.fonts.ready)

// The card is fixed-size, so overflow silently crops the stamp and pins off
// the bottom edge rather than erroring. Check it.
const overflow = await page.evaluate(() => {
  const c = document.querySelector('.content')
  return { scroll: c.scrollHeight, view: window.innerHeight }
})
if (overflow.scroll > overflow.view) {
  throw new Error(`og: content overflows card (${overflow.scroll}px > ${overflow.view}px) — reduce type scale in og-template.html`)
}

await page.screenshot({ path: resolve(root, 'public/og-image.png'), type: 'png' })
await browser.close()

console.log(`og: wrote public/og-image.png (1200x630, content ${overflow.scroll}px)`)
