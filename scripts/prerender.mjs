// Injects the per-locale <head> and the server-rendered markup into each built
// HTML file, turning the SPA into a set of static documents.
//
// Run after `vite build` + `vite build --ssr`. Fails loudly: a silently
// un-prerendered deploy looks fine in a browser and is invisible to every
// non-JS crawler, which is exactly the bug this step exists to prevent.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildHead } from './head.mjs'
import { LOCALES, meta } from '../src/copy.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HEAD = '<!--head-->'
const APP = '<!--app-html-->'

const { render } = await import(resolve(root, 'dist-ssr/entry-server.js'))

// Locale -> built file. 'en' is the root document; every other locale lives in
// a directory matching its URL path.
const outFile = (locale) =>
  locale === 'en' ? resolve(root, 'dist/index.html') : resolve(root, `dist/${locale}/index.html`)

for (const locale of LOCALES) {
  const file = outFile(locale)
  const template = readFileSync(file, 'utf8')

  for (const marker of [HEAD, APP]) {
    if (!template.includes(marker)) {
      throw new Error(`prerender: ${marker} missing from ${file}`)
    }
  }

  const appHtml = render(locale)
  if (!appHtml || appHtml.length < 2000) {
    throw new Error(`prerender: suspiciously small render for "${locale}" (${appHtml?.length ?? 0} chars)`)
  }

  const html = template.replace(HEAD, buildHead(locale)).replace(APP, appHtml)
  writeFileSync(file, html)
  console.log(`prerender: ${locale} -> ${file.replace(root + '/', '')} (${appHtml.length} chars of markup)`)
}

// Sitemap is generated rather than hand-written so locale paths and hreflang
// pairs can never drift from copy.js.
const today = new Date().toISOString().slice(0, 10)

const alternates = LOCALES.map(
  (l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="https://civemate.com${meta[l].path}" />`,
).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LOCALES.map((l) => `  <url>
    <loc>https://civemate.com${meta[l].path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l === 'en' ? '1.0' : '0.9'}</priority>
${alternates}
      <xhtml:link rel="alternate" hreflang="x-default" href="https://civemate.com/" />
  </url>`).join('\n')}
</urlset>
`
writeFileSync(resolve(root, 'dist/sitemap.xml'), sitemap)
console.log(`prerender: sitemap.xml regenerated with ${LOCALES.length} locales`)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
