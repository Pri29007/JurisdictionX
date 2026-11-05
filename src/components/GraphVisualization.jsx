import { useState } from 'react'
import { graph } from '../data/mock'

const COLORS = { complaint: '#FF7518', issue: '#F5B301', asset: '#9146FF', location: '#7C7A8E', department: '#C084FC', action: '#5EEAA0' }
const ICON = { complaint: '🎃', issue: '🕸️', asset: '🏚️', location: '📍', department: '🏛️', action: '⚡' }
const R = 30

// shorten a line so the arrow stops at the node's edge
function trim(a, b, gap) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy)
  return { x: b.x - (dx / len) * gap, y: b.y - (dy / len) * gap }
}

export default function GraphVisualization({ data = graph }) {
  const [sel, setSel] = useState(null)
  const byId = Object.fromEntries(data.nodes.map((n) => [n.id, n]))
  const linked = (id) => id === sel || data.edges.some((e) => (e.from === sel && e.to === id) || (e.to === sel && e.from === id))
  const node = sel && byId[sel]
  const rels = sel ? data.edges.filter((e) => e.from === sel || e.to === sel) : []

  return (
    <div className="card p-0 overflow-hidden">
      <svg viewBox="0 0 960 540" className="w-full h-auto" role="img" aria-label="Jurisdiction knowledge graph for complaint JX-001">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#7a7396" />
          </marker>
          <marker id="arrow-dep" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#FF7518" />
          </marker>
        </defs>
        {data.edges.map((e, i) => {
          const a = byId[e.from], b = byId[e.to]
          const end = trim(a, b, R + 4)
          const on = !sel || e.from === sel || e.to === sel
          return (
            <g key={i} opacity={on ? 1 : 0.1}>
              <line x1={a.x} y1={a.y} x2={end.x} y2={end.y} stroke={e.dep ? '#FF7518' : '#4b4566'} strokeWidth={e.dep ? 2.5 : 1.5} className={e.dep ? 'flow' : ''} markerEnd={`url(#${e.dep ? 'arrow-dep' : 'arrow'})`} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="9" fill="#9b95b5">{e.label}</text>
            </g>
          )
        })}
        {data.nodes.map((n) => (
          <g
            key={n.id}
            tabIndex={0}
            role="button"
            aria-label={`${n.type}: ${n.label}`}
            className="cursor-pointer"
            opacity={sel && !linked(n.id) ? 0.25 : 1}
            onClick={() => setSel(sel === n.id ? null : n.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSel(sel === n.id ? null : n.id)}
          >
            <circle cx={n.x} cy={n.y} r={R} fill="#171522" stroke={COLORS[n.type]} strokeWidth="2" style={{ filter: `drop-shadow(0 0 8px ${COLORS[n.type]}88)` }} />
            <text x={n.x} y={n.y + 7} textAnchor="middle" fontSize="22">{ICON[n.type]}</text>
            <text x={n.x} y={n.y + R + 18} textAnchor="middle" fontSize="12" fill="#F4EFE6">{n.label}</text>
          </g>
        ))}
      </svg>

      <div className="border-t border-white/5 p-4 text-sm">
        {node ? (
          <div>
            <p className="font-medium"><span className="mr-2">{ICON[node.type]}</span>{node.label} <span className="muted font-normal">({node.type})</span></p>
            <p className="muted mt-1">{node.detail}</p>
            {node.source && <p className="text-xs mt-2 text-slime">Source: {node.source}, last verified {node.verified}</p>}
            <p className="muted text-xs mt-2">{rels.map((e) => `${byId[e.from].label} ${e.label} ${byId[e.to].label}`).join('  |  ')}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {Object.entries(COLORS).map(([t, c]) => (
              <span key={t} className="flex items-center gap-1.5 muted text-xs"><i className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{t}</span>
            ))}
            <span className="text-xs text-pumpkin">Dashed orange lines are dependencies. Select a node to inspect it.</span>
          </div>
        )}
      </div>
    </div>
  )
}
