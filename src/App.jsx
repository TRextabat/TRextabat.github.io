import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Check,
  MapPin,
  Menu,
  Music2,
  Paintbrush,
  Plus,
  Theater,
  Users,
  X,
} from 'lucide-react'

const activities = [
  { id: 1, title: 'Rooftop acoustic night', meta: 'Moda · Tonight, 20:30', type: 'Music · +1 open', icon: Music2, className: 'pin-music', image: '/images/rooftop-music.webp', coordinates: [29.0267, 40.9818], people: '18 going' },
  { id: 2, title: 'One-act play reading', meta: 'Yeldeğirmeni · Fri, 19:00', type: 'Theatre · +1 open', icon: Theater, className: 'pin-theatre', image: '/images/theatre-reading.webp', coordinates: [29.0358, 40.9952], people: '8 going' },
  { id: 3, title: 'Street sketch circle', meta: 'Caferağa · Sat, 14:00', type: 'Visual art', icon: Paintbrush, className: 'pin-art', image: '/images/sketch-circle.webp', coordinates: [29.0229, 40.9874], people: '12 going' },
  { id: 4, title: 'Bassist wanted', meta: 'Osmanağa · This week', type: 'Open collaborator role', icon: Users, className: 'pin-role', image: '/images/bassist-wanted.webp', coordinates: [29.0296, 40.9915], people: '1 role open' },
  { id: 5, title: 'Seaside set — live now', meta: 'Moda Sahili · Happening now', type: 'Street performance · Audience welcome', icon: Music2, className: 'pin-live', image: '/images/street-performer.webp', coordinates: [29.0231, 40.9798], people: 'Come listen' },
]

const features = [
  {
    eyebrow: 'DISCOVER',
    title: 'See the city come alive.',
    body: 'Open one map for planned shows, spontaneous sessions, workshops, readings, and everything in between.',
    icon: MapPin,
    className: 'feature-cobalt',
  },
  {
    eyebrow: 'COLLABORATE',
    title: 'Find the missing person.',
    body: 'Create an activity, open a named role, and meet the bassist, photographer, dancer, or maker who completes it.',
    icon: Users,
    className: 'feature-red',
  },
  {
    eyebrow: '+1 BUDDY MODE',
    title: 'Go together, not alone.',
    body: 'Filter for +1-open activities, connect with someone already going, and let the event break the ice.',
    icon: Plus,
    className: 'feature-yellow',
  },
]

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="CiveMate home">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M6 8 54 6 58 54 10 58Z" className="logo-paper" />
        <path d="M44 20C36 14 24 16 20 28S24 48 36 46C42 45 46 41 48 36" className="logo-cut" />
        <path d="m54 6-4 10 8-2Z" className="logo-fold" />
        <rect x="12" y="12" width="6" height="2" className="logo-staple" />
      </svg>
      <span className="wordmark">CIVE<i>M</i>ATE</span>
    </a>
  )
}

function CulturalMap({ activePin, onSelect }) {
  const selected = activities.find((activity) => activity.id === activePin)
  const markerPositions = [
    { left: '48%', top: '39%' },
    { left: '61%', top: '24%' },
    { left: '72%', top: '60%' },
    { left: '54%', top: '66%' },
    { left: '35%', top: '77%' },
  ]

  return (
    <div className="real-map-shell map-enter" aria-label="Illustrated map of cultural activities in Kadıköy">
      <div className="map-live-header">
        <span><i /> LIVE / KADIKÖY</span>
        <strong>{activities.length} ACTIVITIES NEARBY</strong>
      </div>
      <img className="static-map" src="/images/kadikoy-real-art-map.webp" alt="Real street, coastline, park and building map of Kadıköy" />
      <div className="map-ink" aria-hidden="true" />
      {activities.map((activity, index) => (
        <button
          key={activity.id}
          type="button"
          className={`activity-marker static-marker ${activity.className} ${activePin === activity.id ? 'marker-active' : ''}`}
          style={markerPositions[index]}
          onClick={() => onSelect(activity.id)}
          aria-label={`Show ${activity.title}`}
        >
          <span className="marker-photo"><img src={activity.image} alt="" /></span>
          <span className="marker-dot" />
        </button>
      ))}
      <article className="map-activity-card">
        <img src={selected.image} alt="" />
        <div className="map-card-copy">
          <span>{selected.type}</span>
          <strong>{selected.title}</strong>
          <small>{selected.meta} · {selected.people}</small>
          <button type="button">View activity <ArrowRight size={15} /></button>
        </div>
      </article>
      <div className="map-photo-stack" aria-label="More nearby activities">
        {activities.filter((activity) => activity.id !== activePin).slice(0, 2).map((activity) => (
          <button key={activity.id} type="button" onClick={() => onSelect(activity.id)} aria-label={`Show ${activity.title}`}>
            <img src={activity.image} alt="" />
          </button>
        ))}
        <span>+{activities.length - 3}</span>
      </div>
      <div className="map-stamp">NO<br />STAGE<br />REQUIRED</div>
      <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Real Kadıköy map · © OpenStreetMap contributors</a>
    </div>
  )
}

function App() {
  const [activePin, setActivePin] = useState(5)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Culture explorer' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const scrollToWaitlist = () => {
    setMenuOpen(false)
    document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const submitWaitlist = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Add your name and a valid email so we know where to send the demo invite.')
      return
    }

    setStatus('loading')
    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT || 'https://formsubmit.co/ajax/civemateapp@gmail.com'
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'civemate-landing',
          _subject: `New CiveMate demo request — ${form.role}`,
          _template: 'table',
        }),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('idle')
      setError('The list could not be reached. Please try again in a moment.')
    }
  }

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <header className="site-header" id="top">
        <Logo />
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#creators" onClick={() => setMenuOpen(false)}>For creators</a>
          <a href="#inside" onClick={() => setMenuOpen(false)}>Inside the app</a>
          <button className="nav-cta" onClick={scrollToWaitlist}>Join the demo waitlist <ArrowRight size={17} /></button>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy hero-enter">
            <div className="edition">ISTANBUL · FIRST EDITION · 2026</div>
            <h1 id="hero-title">YOUR CITY<br />HAS A <span>CULTURAL</span><br />PULSE.</h1>
            <p className="hero-lede">CiveMate turns cultural ideas into real-world activity. Put a set, rehearsal, workshop, or performance on the live map; find collaborators and an audience; then keep the memory, credit, and community that follow.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={scrollToWaitlist}>Get an early demo <ArrowRight size={20} /></button>
              <a className="text-link" href="#inside">See what the app does <ArrowDown size={18} /></a>
            </div>
            <p className="microcopy">Starting in Kadıköy · For creators, culture lovers, and curious neighbors</p>
          </div>

          <div className="map-stage">
            <CulturalMap activePin={activePin} onSelect={setActivePin} />
            <div className="map-shadow" aria-hidden="true" />
            <div className="map-depth-label" aria-hidden="true">CULTURE / IN REAL SPACE</div>
          </div>
        </section>

        <div className="ticker" aria-label="CiveMate capabilities">
          <div>
            <span>HAPPENING NOW</span><b>✳</b><span>OPEN CREATIVE ROLES</span><b>✳</b><span>+1 BUDDY MODE</span><b>✳</b><span>MEMORY PAGES</span><b>✳</b><span>CULTURAL COMMUNITIES</span><b>✳</b>
            <span aria-hidden="true">HAPPENING NOW</span><b aria-hidden="true">✳</b><span aria-hidden="true">OPEN CREATIVE ROLES</span><b aria-hidden="true">✳</b>
          </div>
        </div>

        <section className="problem" id="how" data-reveal>
          <div className="section-label">WHY CIVEMATE</div>
          <div className="problem-copy">
            <h2>CULTURAL LIFE IS EVERYWHERE.<br /><em>AND INVISIBLE.</em></h2>
            <p>Jam sessions hide in group chats. Readings vanish from stories. A rehearsal needs one more person. A theatre seat stays empty because someone doesn’t want to go alone.</p>
          </div>
          <aside className="pull-quote">
            <span>“</span>
            <p>How was I supposed to know about that?</p>
          </aside>
        </section>

        <section className="features" id="inside" aria-labelledby="features-title" data-reveal>
          <div className="section-heading">
            <div className="section-label">INSIDE THE APP</div>
            <h2 id="features-title">FROM “WHAT’S ON?”<br />TO “I’M IN.”</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article className={`feature-card ${feature.className}`} key={feature.title}>
                  <div className="feature-icon"><Icon size={30} strokeWidth={2.3} /></div>
                  <span>{feature.eyebrow}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="street-artists" id="creators" aria-labelledby="street-title" data-reveal>
          <div className="street-photo">
            <img src="/images/street-performer.webp" alt="Street musician playing an acoustic set beside the Kadıköy waterfront" />
            <span>LIVE · MODA SAHİLİ</span>
          </div>
          <div className="street-copy">
            <div className="section-label">FOR STREET ARTISTS</div>
            <h2 id="street-title">THE STREET<br />IS A <em>STAGE.</em></h2>
            <p>Playing by the water tonight? Mark the set “happening now,” appear on the live map, welcome nearby listeners, or open a role for another musician or photographer.</p>
            <div className="creator-flow" aria-label="Street artist journey">
              <span><b>01</b> Go live</span>
              <span><b>02</b> Gather a crowd</span>
              <span><b>03</b> Find your people</span>
              <span><b>04</b> Keep the credit</span>
            </div>
          </div>
        </section>

        <section className="journey" aria-labelledby="journey-title" data-reveal>
          <div className="journey-copy">
            <div className="section-label">ONE ACTIVITY · MANY PATHS</div>
            <h2 id="journey-title">MAKE A NIGHT<br />HAPPEN.</h2>
            <p>Every journey meets at an activity: someone starts it, someone fills the missing role, someone comes with a new friend, and everyone leaves with a shared memory.</p>
          </div>
          <ol className="journey-steps">
            <li><b>1</b><span><strong>CREATE</strong>Put an idea on the map and open the roles you need.</span></li>
            <li><b>2</b><span><strong>CONNECT</strong>Approve collaborators and welcome visitors or buddies.</span></li>
            <li><b>3</b><span><strong>SHOW UP</strong>Meet in the real world. Make, watch, listen, join.</span></li>
            <li><b>4</b><span><strong>REMEMBER</strong>Keep photos, conversation, and activity credits together.</span></li>
          </ol>
        </section>

        <section className="afterlife" aria-labelledby="afterlife-title" data-reveal>
          <div className="afterlife-heading">
            <div className="section-label">AFTER THE ACTIVITY</div>
            <h2 id="afterlife-title">THE NIGHT ENDS.<br /><span>THE CONNECTION DOESN’T.</span></h2>
            <p>CiveMate keeps the value of showing up alive—so one activity can become a body of work, a circle of people, and the beginning of the next idea.</p>
          </div>
          <div className="afterlife-rows">
            <article><b>01</b><h3>Shared memory</h3><p>Photos, video, comments, ratings, and everyone’s contribution live on one activity page.</p></article>
            <article><b>02</b><h3>Portfolio credit</h3><p>Creators turn real participation into a curated record of what they made and who they made it with.</p></article>
            <article><b>03</b><h3>Stay connected</h3><p>Follow people, share posts and stories, continue in DMs or group chat, and send the next invitation.</p></article>
            <article><b>04</b><h3>Build community</h3><p>Interest, neighborhood, and creator communities make it easier for the next activity to begin.</p></article>
          </div>
          <aside className="institution-note">
            <span>VENUES + INSTITUTIONS</span>
            <p>Theatres, galleries, and cultural centres join the same map with verified profiles, team tools, and attendance insight.</p>
          </aside>
        </section>

        <section className="waitlist" id="waitlist" aria-labelledby="waitlist-title" data-reveal>
          <div className="waitlist-copy">
            <div className="section-label light">DEMO WAITLIST · ISTANBUL</div>
            <h2 id="waitlist-title">HELP US<br /><span>PUT THE FIRST</span><br />PINS ON THE MAP.</h2>
            <p>Join the early demo list. We’ll invite a small group of creators and culture explorers to see CiveMate, try the core flows, and help shape the first neighborhood launch.</p>
            <div className="promise"><Check size={18} /> Demo invitations only. No endless newsletter.</div>
          </div>

          <div className="form-poster">
            {status === 'success' ? (
              <div className="success-state" role="status">
                <div className="success-mark"><Check size={38} /></div>
                <span>YOU’RE ON THE MAP</span>
                <h3>Thanks, {form.name.split(' ')[0]}.</h3>
                <p>We’ll use <strong>{form.email}</strong> for your CiveMate demo invitation.</p>
              </div>
            ) : (
              <form onSubmit={submitWaitlist} noValidate>
                <div className="form-number">NO. 001 / EARLY ACCESS</div>
                <label>
                  Your name
                  <input name="name" value={form.name} onChange={updateField} autoComplete="name" placeholder="How should we call you?" />
                </label>
                <label>
                  Email address
                  <input name="email" value={form.email} onChange={updateField} autoComplete="email" inputMode="email" placeholder="you@example.com" />
                </label>
                <label>
                  I’m joining as
                  <select name="role" value={form.role} onChange={updateField}>
                    <option>Culture explorer</option>
                    <option>Artist or creator</option>
                    <option>Collective or community</option>
                    <option>Venue or institution</option>
                  </select>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button form-button" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Adding your pin…' : <>Join the demo waitlist <ArrowRight size={20} /></>}
                </button>
                <p className="form-note">By joining, you agree to receive emails about the CiveMate demo. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <Logo />
        <p>Sahne gerekmez. No stage required.</p>
        <div><a href="mailto:civemateapp@gmail.com">civemateapp@gmail.com</a><span>© 2026 CiveMate</span></div>
      </footer>
    </>
  )
}

export default App
