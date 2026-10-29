import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import './App.css'
import { HeroDrawing, Wireframe } from './components/Drawings'
import { Crosshair, ScrollRuler, Typewriter, useActiveSection, useReveal } from './components/Effects'
import { CorgiPhoto, DraftingTools, useKonami } from './components/Toys'
import { experience, profile, projects, skills, stats } from './data'

const sections = [
  { id: 'about', label: 'O mnie' },
  { id: 'projects', label: 'Projekty' },
  { id: 'skills', label: 'Umiejętności' },
  { id: 'experience', label: 'Doświadczenie' },
  { id: 'crew', label: 'Ekipa' },
  { id: 'contact', label: 'Kontakt' },
]
const sectionIds = sections.map((s) => s.id)
const sheetCount = String(sections.length).padStart(2, '0')

const delay = (i: number) => ({ '--d': `${i * 90}ms` }) as CSSProperties

function SectionHeader({ sheet, title }: { sheet: string; title: string }) {
  return (
    <header className="section-header reveal">
      <span className="sheet-no">ARKUSZ {sheet}</span>
      <h2>{title}</h2>
      <span className="section-rule" />
    </header>
  )
}

// Moves the card's spotlight to follow the cursor.
function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

function App() {
  const year = new Date().getFullYear()
  const active = useActiveSection(sectionIds)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [approved, setApproved] = useState(false)
  useReveal()
  useKonami(() => setApproved((a) => !a))

  // Easter egg: the blueprint gets printed as a whiteprint and stamped.
  useEffect(() => {
    document.documentElement.classList.toggle('whiteprint', approved)
  }, [approved])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <main className="main-container">
      <Crosshair />
      <ScrollRuler />
      <div className="sheet-border" aria-hidden="true" />
      <DraftingTools />

      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <a href="#top" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-box">{profile.name.charAt(0)}</span>
          {profile.name.toUpperCase()}
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-label="Przełącz menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        <ul>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={active === s.id ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-index">0{i + 1}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-text">
          {profile.available && (
            <span className="status">
              <span className="status-dot" />
              DOSTĘPNY DO NOWYCH PROJEKTÓW
            </span>
          )}
          <p className="eyebrow">// PROJEKT: PORTFOLIO — WER. {year}</p>
          <h1>
            <span className="hero-name">{profile.name}</span>
            <span className="hero-role">
              <Typewriter words={profile.roles} />
            </span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-solid">Zobacz rysunki</a>
            <a href="#contact" className="btn">Napisz do mnie</a>
          </div>
        </div>
        <div className="hero-figure">
          <HeroDrawing />
          <span className="figure-caption">RYS. 1 — WIDOK Z PRZODU STANOWISKA PROGRAMISTY</span>
        </div>
        <a href="#about" className="scroll-cue" aria-label="Przewiń do sekcji O mnie">
          <span>PRZEWIŃ</span>
          <span className="scroll-line" />
        </a>
      </section>

      {/* SPEC TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <span key={n}>
              {skills.map((s) => (
                <span key={s.part}>
                  {s.part.toUpperCase()} <b>◆</b>{' '}
                </span>
              ))}
              CZYSTY KOD <b>◆</b> PRECYZJA CO DO PIKSELA <b>◆</b> DOBRE PIESKI <b>◆</b>{' '}
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="section">
        <SectionHeader sheet="01" title="O mnie" />
        <div className="about-grid">
          <div className="about-text reveal">
            <div className="about-loop">
              {[0, 1].map((copy) => (
                <div key={copy} className="about-loop-copy" aria-hidden={copy === 1}>
                  {profile.about.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="stats">
            {stats.map((s, i) => (
              <div key={s.label} className="stat frame reveal" style={delay(i)}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <SectionHeader sheet="02" title="Projekty" />
        <div className="projects">
          {projects.map((p, i) => (
            <a
              key={p.code}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="project frame reveal"
              style={delay(i)}
              onMouseMove={trackSpotlight}
            >
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <div className="project-head">
                <span className="project-code">{p.code}</span>
                <span className="project-arrow">↗</span>
              </div>
              <Wireframe kind={p.kind} />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul className="tags">
                {p.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <SectionHeader sheet="03" title="Umiejętności" />
        <div className="table-wrap reveal">
          <table className="bom">
            <caption>WYKAZ CZĘŚCI</caption>
            <thead>
              <tr>
                <th>Poz.</th>
                <th>Część</th>
                <th>Kategoria</th>
                <th>Tolerancja</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, i) => (
                <tr key={s.part}>
                  <td>{String(i + 1).padStart(2, '0')}</td>
                  <td>{s.part}</td>
                  <td>{s.category}</td>
                  <td>
                    <div className="meter">
                      <span style={{ '--level': `${s.level}%`, ...delay(i) } as CSSProperties} />
                    </div>
                    <span className="meter-value">{s.level}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <SectionHeader sheet="04" title="Doświadczenie" />
        <ol className="revisions">
          {experience.map((e, i) => (
            <li key={e.rev} className="revision reveal" style={delay(i)}>
              <span className="rev-badge">{e.rev}</span>
              <div>
                <span className="rev-period">{e.period}</span>
                <h3>
                  {e.title} <span className="rev-place">@ {e.place}</span>
                </h3>
                <p>{e.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CREW */}
      <section id="crew" className="section">
        <SectionHeader sheet="05" title="Ekipa" />
        <div className="crew frame reveal">
          <CorgiPhoto />
          <div className="crew-spec">
            <span className="crew-fig">RYS. 5 — DZIAŁ MORALE</span>
            <h3>Corgi</h3>
            <p className="crew-role">Losowo przydzielony</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <SectionHeader sheet="06" title="Kontakt" />
        <div className="contact frame reveal" onMouseMove={trackSpotlight}>
          <p className="contact-lead">Masz pomysł na projekt? Rozrysujmy go razem.</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="contact-links">
            <button type="button" className="btn btn-solid" onClick={copyEmail}>
              {copied ? '✓ Skopiowano' : 'Kopiuj e-mail'}
            </button>
            {profile.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TITLE BLOCK */}
      <footer className="title-block">
        <div className="tb-cell tb-wide">
          <span className="tb-label">Tytuł</span>
          <span className="tb-value">{profile.name} — Portfolio</span>
        </div>
        <div className="tb-cell">
          <span className="tb-label">Rysował</span>
          <span className="tb-value">{profile.name}</span>
        </div>
    
        <div className="tb-cell">
          <span className="tb-label">Skala</span>
          <span className="tb-value">1 : 1</span>
        </div>
        <div className="tb-cell">
          <span className="tb-label">Data</span>
          <span className="tb-value">{year}</span>
        </div>
        <div className="tb-cell">
          <span className="tb-label">Arkusz</span>
          <span className="tb-value">{sheetCount} / {sheetCount}</span>
        </div>
        {approved && (
          <div className="stamp" role="status">
            ZATWIERDZONO
            <small>ARKUSZ 07 — KOPIA OZALIDOWA</small>
          </div>
        )}
      </footer>
    </main>
  )
}

export default App
