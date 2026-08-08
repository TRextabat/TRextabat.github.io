// Generates the per-locale <head> contents (metadata + JSON-LD) from a single
// source of truth in src/copy.js. Two hand-maintained HTML heads would drift —
// and a stale canonical or a missing hreflang pair is the kind of SEO bug that
// is invisible until a search engine quietly picks the wrong page.
import { meta, copy, keywords } from '../src/copy.js'

const ORIGIN = 'https://civemate.com'
const url = (locale) => `${ORIGIN}${meta[locale].path}`

const orgDescription = {
  en: "CiveMate is a cultural activities platform that puts a city's concerts, readings, workshops, rehearsals and street performances on one live map, and lets creators open roles for the collaborators they are missing.",
  tr: 'CiveMate, bir şehrin konserlerini, okumalarını, atölyelerini, provalarını ve sokak performanslarını tek bir canlı haritada toplayan ve üreticilerin eksik kaldıkları roller için çağrı açmasını sağlayan bir kültürel etkinlik platformudur.',
}

const appDescription = {
  en: 'Discover cultural activities happening near you on a live map, create your own, open named roles for collaborators, and find a +1 so you never have to go alone.',
  tr: 'Yakınında olan kültür etkinliklerini canlı haritada keşfet, kendi etkinliğini oluştur, birlikte üretecekler için adı konmuş roller aç ve asla yalnız gitmek zorunda kalmamak için bir +1 bul.',
}

const featureList = {
  en: [
    'Live map of cultural activities happening nearby',
    'Create an activity and open named collaborator roles',
    '+1 buddy mode for going to events with someone',
    'Shared memory pages with photos, comments and credits',
    'Portfolio credit for creators',
    'Verified profiles for venues and institutions',
  ],
  tr: [
    'Yakında olan kültür etkinliklerinin canlı haritası',
    'Etkinlik oluştur ve adı konmuş üretici rolleri aç',
    'Etkinliklere birlikte gitmek için +1 modu',
    'Fotoğraf, yorum ve emeklerin bir arada durduğu ortak anı sayfaları',
    'Üreticiler için portfolyo emeği',
    'Mekânlar ve kurumlar için doğrulanmış profiller',
  ],
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function jsonLd(locale) {
  const m = meta[locale]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#organization`,
        name: 'CiveMate',
        url: `${ORIGIN}/`,
        email: 'civemateapp@gmail.com',
        logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon.svg` },
        description: orgDescription[locale],
        slogan: locale === 'tr' ? 'Sahne gerekmez.' : 'No stage required.',
        foundingDate: '2026',
        areaServed: {
          '@type': 'City',
          name: 'Istanbul',
          address: { '@type': 'PostalAddress', addressLocality: 'Istanbul', addressCountry: 'TR' },
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: `${ORIGIN}/`,
        name: 'CiveMate',
        description: m.description,
        publisher: { '@id': `${ORIGIN}/#organization` },
        inLanguage: locale,
      },
      {
        '@type': 'WebPage',
        '@id': `${url(locale)}#webpage`,
        url: url(locale),
        name: m.title,
        description: m.description,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        inLanguage: locale,
        keywords: keywords[locale].join(', '),
        about: [
          'Concert', 'Theatre', 'Cinema', 'Exhibition', 'Dance',
          'Workshop', 'Street performance', 'Cultural event',
        ].map((name) => ({ '@type': 'Thing', name })),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${ORIGIN}/#app`,
        name: 'CiveMate',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'iOS, Android',
        url: `${ORIGIN}/`,
        publisher: { '@id': `${ORIGIN}/#organization` },
        description: appDescription[locale],
        featureList: featureList[locale],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url(locale)}#faq`,
        inLanguage: locale,
        mainEntity: copy[locale].faq.items.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }
}

export function buildHead(locale) {
  const m = meta[locale]
  const alternates = Object.keys(meta)
    .map((l) => `    <link rel="alternate" hreflang="${l}" href="${url(l)}" />`)
    .join('\n')

  return `<title>${escape(m.title)}</title>
    <meta name="description" content="${escape(m.description)}" />
    <link rel="canonical" href="${url(locale)}" />

    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="CiveMate" />
    <meta name="keywords" content="${escape(keywords[locale].join(', '))}" />

${alternates}
    <link rel="alternate" hreflang="x-default" href="${url('en')}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CiveMate" />
    <meta property="og:url" content="${url(locale)}" />
    <meta property="og:title" content="${escape(m.ogTitle)}" />
    <meta property="og:description" content="${escape(m.ogDescription)}" />
    <meta property="og:image" content="${ORIGIN}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(m.ogImageAlt)}" />
    <meta property="og:locale" content="${m.ogLocale}" />
${Object.keys(meta).filter((l) => l !== locale).map((l) => `    <meta property="og:locale:alternate" content="${meta[l].ogLocale}" />`).join('\n')}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(m.ogTitle)}" />
    <meta name="twitter:description" content="${escape(m.ogDescription)}" />
    <meta name="twitter:image" content="${ORIGIN}/og-image.png" />
    <meta name="twitter:image:alt" content="${escape(m.ogImageAlt)}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd(locale), null, 2)}
    </script>`
}

export { meta, ORIGIN, url }
