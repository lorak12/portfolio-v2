import { useEffect, useState } from 'react'

export function Crosshair() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div className="crosshair-x" style={{ top: pos.y }} />
      <div className="crosshair-y" style={{ left: pos.x }} />
      <div className="coords">
        X {String(pos.x).padStart(4, '0')} · Y {String(pos.y).padStart(4, '0')}
      </div>
    </>
  )
}

// Vertical ruler on the left edge that tracks scroll progress.
export function ScrollRuler() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="ruler" aria-hidden="true">
      <div className="ruler-fill" style={{ height: `${progress * 100}%` }} />
      <div className="ruler-marker" style={{ top: `${progress * 100}%` }}>
        {String(Math.round(progress * 100)).padStart(3, '0')}
      </div>
    </div>
  )
}

export function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const word = words[index % words.length]

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (!deleting && length === word.length) {
      timer = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && length === 0) {
      timer = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => i + 1)
      }, 300)
    } else {
      timer = setTimeout(() => setLength((l) => l + (deleting ? -1 : 1)), deleting ? 35 : 75)
    }
    return () => clearTimeout(timer)
  }, [length, deleting, word])

  return (
    <span className="typewriter">
      {word.slice(0, length)}
      <span className="caret" />
    </span>
  )
}

// Fades in every `.reveal` element the first time it scrolls into view.
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}
