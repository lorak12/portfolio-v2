import type { ProjectKind } from '../data'

export function HeroDrawing() {
  return (
    <svg className="hero-drawing" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="arrow-head" />
        </marker>
      </defs>

      {/* construction circles */}
      <circle cx="200" cy="200" r="150" className="thin dashed spin" />
      <circle cx="200" cy="200" r="110" className="thin" />
      <line x1="30" y1="200" x2="370" y2="200" className="thin center" />
      <line x1="200" y1="30" x2="200" y2="370" className="thin center" />

      {/* main part: monitor */}
      <rect x="110" y="130" width="180" height="120" rx="6" className="bold" />
      <rect x="122" y="142" width="156" height="96" className="thin" />
      <path d="M180 250 L172 285 L228 285 L220 250" className="bold" />
      <line x1="150" y1="285" x2="250" y2="285" className="bold" />

      {/* code glyph */}
      <path d="M170 175 L152 190 L170 205" className="bold accent" />
      <path d="M230 175 L248 190 L230 205" className="bold accent" />
      <line x1="208" y1="170" x2="192" y2="210" className="bold accent" />

      {/* dimension: width */}
      <line x1="110" y1="110" x2="290" y2="110" className="thin" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <line x1="110" y1="104" x2="110" y2="128" className="thin" />
      <line x1="290" y1="104" x2="290" y2="128" className="thin" />
      <text x="200" y="104" className="dim-label" textAnchor="middle">180</text>

      {/* dimension: height */}
      <line x1="315" y1="130" x2="315" y2="250" className="thin" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <line x1="292" y1="130" x2="322" y2="130" className="thin" />
      <line x1="292" y1="250" x2="322" y2="250" className="thin" />
      <text x="330" y="194" className="dim-label">120</text>

      {/* leader note */}
      <path d="M248 205 L300 300 L360 300" className="thin" />
      <circle cx="248" cy="205" r="2.5" className="fill" />
      <text x="304" y="294" className="dim-label">BUILD.TSX</text>

      <text x="68" y="90" className="dim-label">R150</text>
    </svg>
  )
}

// Small UI wireframe used as a project thumbnail.
export function Wireframe({ kind }: { kind: ProjectKind }) {
  return (
    <svg className="wireframe" viewBox="0 0 240 130" aria-hidden="true">
      <rect x="1" y="1" width="238" height="128" rx="4" className="wf-frame" />
      <line x1="1" y1="16" x2="239" y2="16" className="wf-line" />
      <circle cx="10" cy="8.5" r="2.5" className="wf-line" />
      <circle cx="19" cy="8.5" r="2.5" className="wf-line" />
      <circle cx="28" cy="8.5" r="2.5" className="wf-line" />
      <rect x="70" y="5" width="100" height="7" rx="3.5" className="wf-line" />

      {kind === 'board' &&
        [0, 1, 2].map((c) => (
          <g key={c}>
            <rect x={12 + c * 74} y="26" width="66" height="94" className="wf-line dashed" />
            {Array.from({ length: 3 - c + 1 }, (_, r) => (
              <rect key={r} x={18 + c * 74} y={34 + r * 22} width="54" height="16" className="wf-fill" />
            ))}
          </g>
        ))}

      {kind === 'chart' && (
        <>
          <rect x="12" y="26" width="64" height="40" className="wf-fill" />
          <rect x="88" y="26" width="64" height="40" className="wf-fill" />
          <rect x="164" y="26" width="64" height="40" className="wf-fill" />
          <path d="M12 116 L50 96 L86 104 L124 80 L160 88 L196 72 L228 78" className="wf-accent" />
          <line x1="12" y1="118" x2="228" y2="118" className="wf-line" />
        </>
      )}

      {kind === 'grid' &&
        [0, 1, 2, 3].map((c) =>
          [0, 1].map((r) => (
            <g key={`${c}-${r}`}>
              <rect x={12 + c * 56} y={26 + r * 50} width="48" height="30" className="wf-fill" />
              <line x1={12 + c * 56} y1={62 + r * 50} x2={48 + c * 56} y2={62 + r * 50} className="wf-line" />
            </g>
          )),
        )}

      {kind === 'chat' && (
        <>
          <rect x="12" y="26" width="110" height="18" rx="9" className="wf-fill" />
          <rect x="118" y="50" width="110" height="18" rx="9" className="wf-accent-fill" />
          <rect x="12" y="74" width="80" height="18" rx="9" className="wf-fill" />
          <rect x="12" y="104" width="190" height="16" rx="3" className="wf-line" />
          <rect x="208" y="104" width="20" height="16" rx="3" className="wf-accent-fill" />
        </>
      )}
    </svg>
  )
}
