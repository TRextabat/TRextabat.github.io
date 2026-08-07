// Injects the server-rendered markup from the SSR bundle into the built
// client HTML, turning the SPA into a static page for crawlers.
//
// Run after `vite build` + `vite build --ssr`. Fails loudly: a silently
// un-prerendered deploy looks fine in a browser and is invisible to every
// non-JS crawler, which is exactly the bug this step exists to prevent.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const htmlPath = resolve(root, 'dist/index.html')
const PLACEHOLDER = '<!--app-html-->'

const template = readFileSync(htmlPath, 'utf8')
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`prerender: ${PLACEHOLDER} missing from dist/index.html`)
}

const { render } = await import(resolve(root, 'dist-ssr/entry-server.js'))
const appHtml = render()

if (!appHtml || appHtml.length < 2000) {
  throw new Error(`prerender: suspiciously small render output (${appHtml?.length ?? 0} chars)`)
}

writeFileSync(htmlPath, template.replace(PLACEHOLDER, appHtml))
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`prerender: injected ${appHtml.length} chars of static markup into dist/index.html`)
