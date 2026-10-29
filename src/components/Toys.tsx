import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react'

type ToolKind = 'square' | 'protractor' | 'pencil'

type ToolSpec = {
  kind: ToolKind
  anchor: string // section id the tool starts on
  w: number
  h: number
  angle: number
}

const tools: ToolSpec[] = [
  { kind: 'pencil', anchor: 'projects', w: 130, h: 16, angle: -24 },
  { kind: 'square', anchor: 'skills', w: 130, h: 130, angle: 0 },
  { kind: 'protractor', anchor: 'experience', w: 160, h: 84, angle: 8 },
]

const SNAP = 15 // degrees per double-click, like a real adjustable set square
const FRICTION = 0.92
const PENCIL_TIP = -65 // pencil tip offset from its centre, along its length

const shapes: Record<ToolKind, ReactNode> = {
  square: (
    <svg viewBox="0 0 130 130">
      <path d="M2 2 V128 H128 Z M24 48 V106 H82 Z" fillRule="evenodd" className="tool-body" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={10 + i * 10} y1="128" x2={10 + i * 10} y2={i % 5 === 4 ? 118 : 123} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="2" y1={118 - i * 10} x2={i % 5 === 4 ? 12 : 7} y2={118 - i * 10} />
      ))}
      <text x="30" y="122">45°</text>
    </svg>
  ),
  protractor: (
    <svg viewBox="0 0 160 84">
      <path d="M2 82 A78 78 0 0 1 158 82 Z M40 82 A40 40 0 0 1 120 82 Z" fillRule="evenodd" className="tool-body" />
      {Array.from({ length: 19 }, (_, i) => {
        const a = (Math.PI * i) / 18
        const inner = i % 9 === 0 ? 62 : i % 3 === 0 ? 68 : 72
        return (
          <line
            key={i}
            x1={80 + Math.cos(a) * 78}
            y1={82 - Math.sin(a) * 78}
            x2={80 + Math.cos(a) * inner}
            y2={82 - Math.sin(a) * inner}
          />
        )
      })}
      <text x="73" y="58">90</text>
      <circle cx="80" cy="82" r="2" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 130 16">
      <path d="M0 8 L8 5.5 V10.5 Z" className="tool-lead" />
      <path d="M8 5.5 L22 1 H112 V15 H22 L8 10.5 Z" className="tool-wood" />
      <rect x="22" y="1" width="90" height="14" className="tool-paint" />
      <rect x="112" y="1" width="8" height="14" className="tool-ferrule" />
      <rect x="120" y="1" width="10" height="14" rx="3" className="tool-eraser" />
      <text x="40" y="11.5">HB</text>
    </svg>
  ),
}

function Tool({ spec, trail }: { spec: ToolSpec; trail: RefObject<SVGSVGElement | null> }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const state = useRef({ x: 0, y: 0, r: spec.angle, vx: 0, vy: 0, t: 0, frame: 0 })
  const drag = useRef<{ dx: number; dy: number; path: SVGPathElement | null } | null>(null)

  const bounds = () => {
    const layer = wrapRef.current!.parentElement!
    return { maxX: layer.clientWidth - spec.w, maxY: layer.clientHeight - spec.h }
  }

  const render = () => {
    const s = state.current
    wrapRef.current!.style.transform = `translate(${s.x}px, ${s.y}px)`
    bodyRef.current!.style.transform = `rotate(${s.r}deg)`
    const deg = ((Math.round(s.r) % 360) + 360) % 360
    labelRef.current!.textContent =
      `X ${String(Math.round(s.x)).padStart(4, '0')} · Y ${String(Math.round(s.y)).padStart(4, '0')} · ∠ ${deg}°`
  }

  const tip = () => {
    const s = state.current
    const a = (s.r * Math.PI) / 180
    return { x: s.x + spec.w / 2 + Math.cos(a) * PENCIL_TIP, y: s.y + spec.h / 2 + Math.sin(a) * PENCIL_TIP }
  }

  // Park the tool on the right end of its section's header line.
  useLayoutEffect(() => {
    const section = document.getElementById(spec.anchor)
    const layer = wrapRef.current!.parentElement!
    const s = state.current
    if (!section) return
    s.x = layer.clientWidth - spec.w - 12
    s.y = section.offsetTop + 90 - spec.h / 2 + 24
    render()
    return () => cancelAnimationFrame(s.frame)
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    cancelAnimationFrame(state.current.frame)
    const s = state.current
    Object.assign(s, { vx: 0, vy: 0, t: e.timeStamp })
    let path: SVGPathElement | null = null
    if (spec.kind === 'pencil' && trail.current) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const p = tip()
      path.setAttribute('d', `M${p.x} ${p.y}`)
      trail.current.appendChild(path)
    }
    drag.current = { dx: e.clientX - s.x, dy: e.clientY - s.y, path }
    wrapRef.current!.classList.add('dragging')
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const s = state.current
    const { maxX, maxY } = bounds()
    const x = Math.min(Math.max(e.clientX - d.dx, 0), maxX)
    const y = Math.min(Math.max(e.clientY - d.dy, 0), maxY)
    const dt = Math.max(e.timeStamp - s.t, 1)
    // Velocity in px per 16ms frame, smoothed so the throw follows the last flick.
    s.vx = s.vx * 0.5 + ((x - s.x) / dt) * 8
    s.vy = s.vy * 0.5 + ((y - s.y) / dt) * 8
    Object.assign(s, { x, y, t: e.timeStamp })
    render()
    if (d.path) {
      const p = tip()
      d.path.setAttribute('d', `${d.path.getAttribute('d')} L${p.x} ${p.y}`)
    }
  }

  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    wrapRef.current!.classList.remove('dragging')
    if (d.path) {
      const path = d.path
      path.classList.add('fading')
      setTimeout(() => path.remove(), 2600)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Throw: slide with friction, bounce off the sheet edges, spin a little.
    const step = () => {
      const s = state.current
      const { maxX, maxY } = bounds()
      s.vx *= FRICTION
      s.vy *= FRICTION
      s.x += s.vx
      s.y += s.vy
      s.r += s.vx * 0.4
      if (s.x < 0 || s.x > maxX) {
        s.x = Math.min(Math.max(s.x, 0), maxX)
        s.vx *= -0.6
      }
      if (s.y < 0 || s.y > maxY) {
        s.y = Math.min(Math.max(s.y, 0), maxY)
        s.vy *= -0.6
      }
      render()
      if (Math.hypot(s.vx, s.vy) > 0.15) s.frame = requestAnimationFrame(step)
    }
    state.current.frame = requestAnimationFrame(step)
  }

  const onDoubleClick = () => {
    const s = state.current
    s.r = Math.round(s.r / SNAP) * SNAP + SNAP
    render()
  }

  return (
    <div ref={wrapRef} className={`tool tool-${spec.kind}`} style={{ width: spec.w, height: spec.h }}>
      <span ref={labelRef} className="tool-label" />
      <div
        ref={bodyRef}
        className="tool-shape"
        title="Przeciągnij lub rzuć · dwuklik = obrót o 15°"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        {shapes[spec.kind]}
      </div>
    </div>
  )
}

// Drafting instruments lying around the sheet that you can drag, throw and spin.
export function DraftingTools() {
  const trail = useRef<SVGSVGElement>(null)
  return (
    <div className="tools-layer" aria-hidden="true">
      <svg ref={trail} className="pencil-trail" />
      {tools.map((t) => (
        <Tool key={t.kind} spec={t} trail={trail} />
      ))}
    </div>
  )
}

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

// Calls `onUnlock` every time the Konami code is typed.
export function useKonami(onUnlock: () => void) {
  useEffect(() => {
    console.log(
      '%c// ARKUSZ 07 — NIEZATWIERDZONY\n%c↑ ↑ ↓ ↓ ← → ← → B A',
      'color:#ffd166;font:bold 13px monospace',
      'color:#9ab;font:12px monospace',
    )
    let progress = 0
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === KONAMI[progress]) progress++
      else if (key === KONAMI[0]) progress = progress === 2 ? 2 : 1 // ↑↑↑ still counts as ↑↑
      else progress = 0
      if (progress === KONAMI.length) {
        progress = 0
        onUnlock()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onUnlock])
}

const CORGI_API = 'https://dog.ceo/api/breed/pembroke/images/random'

// A random corgi photo from dog.ceo; clicking fetches another one.
export function CorgiPhoto() {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const fetchCorgi = useCallback(async () => {
    try {
      const res = await fetch(CORGI_API)
      const data: { message: string; status: string } = await res.json()
      if (data.status !== 'success') throw new Error(data.status)
      setSrc(data.message)
      setFailed(false)
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    fetchCorgi()
  }, [fetchCorgi])

  return (
    <div className="corgi-wrap">
      <button type="button" className="corgi-btn" onClick={fetchCorgi} aria-label="Pokaż innego corgi">
        {src ? (
          <img className="corgi-photo" src={src} alt="Losowy corgi" />
        ) : (
          <span className="corgi-photo corgi-placeholder">{failed ? 'PIESEK ZAGINĄŁ' : 'ŁADOWANIE…'}</span>
        )}
      </button>
      <span className="corgi-hint">KLIKNIJ, ABY WYLOSOWAĆ INNEGO</span>
    </div>
  )
}
