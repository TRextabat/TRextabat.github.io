// Generates the per-locale <head> contents (metadata + JSON-LD) from a single
// source of truth in src/copy.js. Two hand-maintained HTML heads would drift —
// and a stale canonical or a missing hreflang pair is the kind of SEO bug that
// is invisible until a search engine quietly picks the wrong page.
import { meta } from '../src/copy.js'

const ORIGIN = 'https://civemate.com'
const url = (locale) => `${ORIGIN}${meta[locale].path}`

const faq = {
  en: [
    ['What is CiveMate?', "CiveMate is a cultural activities platform that puts your city's cultural life on one live map. You can see planned shows, spontaneous sessions, workshops and readings near you, create your own activity, and find the collaborators or company you need to make it happen."],
    ['Where does CiveMate launch first?', 'CiveMate is starting in Kadıköy, Istanbul, with the first neighbourhood edition in 2026. Izmir and Antalya follow as further priority cities.'],
    ['Does it cost anything to join an activity?', 'No. Activities on CiveMate are always free to join.'],
    ['What is +1 buddy mode?', "+1 buddy mode lets you filter for activities where someone is open to bringing a companion. You connect with a person who is already going, and the event itself breaks the ice, so an empty theatre seat or a concert you didn't want to attend alone stops being a reason to stay home."],
    ['Who is CiveMate for?', 'CiveMate is for creators and street artists who want an audience and collaborators, for culture lovers looking for something to do nearby, and for venues, theatres, galleries and cultural centres, who join the same map with verified profiles and team tools.'],
    ['How do creators find missing collaborators?', "When you create an activity you can open a named role — a bassist, a photographer, a dancer, a maker — and people nearby can apply to fill it. You approve who joins, and everyone's contribution is credited on the activity page afterwards."],
  ],
  tr: [
    ['CiveMate nedir?', 'CiveMate, şehrinin kültür hayatını tek bir canlı haritada toplayan bir kültürel etkinlik platformudur. Yakınındaki planlanmış konserleri, anlık sessionları, atölyeleri ve okumaları görebilir, kendi etkinliğini oluşturabilir ve onu gerçekleştirmek için ihtiyacın olan üreticileri ya da arkadaşlığı bulabilirsin.'],
    ['CiveMate ilk nerede başlıyor?', "CiveMate 2026'da ilk mahalle sürümüyle İstanbul Kadıköy'de başlıyor. Ardından öncelikli şehirler olarak İzmir ve Antalya geliyor."],
    ['Etkinliğe katılmak ücretli mi?', 'Hayır. CiveMate’teki etkinliklere katılmak her zaman ücretsizdir.'],
    ['+1 modu nedir?', '+1 modu, birinin yanında biri getirmeye açık olduğu etkinlikleri filtrelemeni sağlar. Zaten gidecek biriyle bağlantı kurarsın ve buzları etkinliğin kendisi kırar; böylece boş bir tiyatro koltuğu ya da yalnız gitmek istemediğin bir konser evde kalma sebebi olmaktan çıkar.'],
    ['CiveMate kimler için?', 'CiveMate; seyirci ve birlikte üretecek insan arayan üreticiler ve sokak sanatçıları, yakınında yapacak bir şey arayan kültür severler ve aynı haritaya doğrulanmış profiller ve ekip araçlarıyla katılan mekânlar, tiyatrolar, galeriler ve kültür merkezleri içindir.'],
    ['Üretenler eksik ekip arkadaşlarını nasıl buluyor?', 'Bir etkinlik oluştururken adı konmuş bir rol açabilirsin — basçı, fotoğrafçı, dansçı, üretici — ve yakındaki insanlar bu role başvurabilir. Kimin katılacağını sen onaylarsın ve herkesin katkısı sonrasında etkinlik sayfasında emek olarak görünür.'],
  ],
}

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
        mainEntity: faq[locale].map(([q, a]) => ({
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
