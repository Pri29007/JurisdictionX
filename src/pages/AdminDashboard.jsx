import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { FileText, GitMerge, Clock, Flag } from 'lucide-react'
import StatCard from '../components/StatCard'
import { GhostCop, Pumpkin } from '../components/Spooky'
import { getAnalytics } from '../services/api'

const ICONS = [FileText, GitMerge, Clock, Flag]
const tip = { contentStyle: { background: '#171522', border: '1px solid #2a2540', borderRadius: 12, color: '#F4EFE6' }, cursor: { fill: 'rgba(255,255,255,0.04)' } }
const tick = { fill: '#9b95b5', fontSize: 12 }
const LINES = { Waterlogging: '#FF7518', Roads: '#9146FF', Garbage: '#F5B301', Lights: '#5EEAA0' }
const FUNNEL = ['#9146FF', '#9146FF', '#C084FC', '#FF7518']

export default function AdminDashboard() {
  const [d, setD] = useState(null)
  useEffect(() => { getAnalytics().then(setD) }, [])
  if (!d) return <p className="muted">Loading analytics...</p>

  const forwarded = d.funnel[2].value, answered = d.funnel[3].value
  const drop = Math.round((answered / forwarded) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Pumpkin size={52} className="animate-flicker" />
          <div>
            <h1 className="h-display text-3xl">Coordination analytics</h1>
            <p className="muted text-sm mt-1">Where complaints get stuck between departments.</p>
          </div>
        </div>
        <span className="badge border-witch/40 text-purple-300 bg-witch/10">Illustrative synthetic data</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {d.stats.map((s, i) => <StatCard key={s.label} {...s} icon={ICONS[i]} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="h-display text-lg">Handover funnel</h2>
          <p className="muted text-sm mb-2">Of 100 cases needing two departments, how many reach each stage.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.funnel} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="stage" width={150} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip {...tip} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} label={{ position: 'right', fill: '#F4EFE6', fontSize: 12 }}>
                {d.funnel.map((_, i) => <Cell key={i} fill={FUNNEL[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card border-pumpkin/40 shadow-glow relative overflow-hidden">
          <GhostCop size={86} className="absolute -right-1 top-1 animate-bob" />
          <Pumpkin size={40} className="mb-2" />
          <h2 className="h-display text-lg pr-16">Possible bottleneck</h2>
          <p className="text-sm mt-2">Only {answered} of {forwarded} forwarded cases ({drop}%) got a response from the second department inside the timeline.</p>
          <p className="muted text-sm mt-3">Officer Boo suggests reviewing the handover between Drainage and Roads, and escalating the {d.stats[2].value} delayed cases to the nodal officer.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="h-display text-lg mb-3">Open complaints by department</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.byDept}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip {...tip} />
              <Bar dataKey="open" fill="#FF7518" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="h-display text-lg mb-3">Complaints by category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={d.trends}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="m" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip {...tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {Object.entries(LINES).map(([k, c]) => <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2.5} dot={false} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="card lg:col-span-3">
          <h2 className="h-display text-lg mb-3">Unresolved hotspots</h2>
          <svg viewBox="0 0 560 320" className="w-full h-auto rounded-xl bg-night/70" role="img" aria-label="Hotspot map of unresolved complaints">
            {Array.from({ length: 8 }).map((_, i) => <line key={'h' + i} x1="0" x2="560" y1={i * 40 + 20} y2={i * 40 + 20} stroke="#ffffff08" />)}
            {Array.from({ length: 14 }).map((_, i) => <line key={'v' + i} y1="0" y2="320" x1={i * 40 + 20} x2={i * 40 + 20} stroke="#ffffff08" />)}
            {d.hotspots.map((h) => (
              <g key={h.name}>
                <circle cx={h.x} cy={h.y} r={14 + h.n * 0.9} fill="#FF7518" opacity="0.15" />
                <text x={h.x} y={h.y} textAnchor="middle" dominantBaseline="central" fontSize={18 + h.n * 0.7}>🎃</text>
                <text x={h.x} y={h.y + 26 + h.n * 0.8} textAnchor="middle" fontSize="11" fill="#F4EFE6">{h.name} ({h.n})</text>
              </g>
            ))}
          </svg>
          <p className="muted text-xs mt-2">Stylised map. Bigger pumpkins mean more unresolved complaints. Swap in Amazon Location Service later.</p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="h-display text-lg mb-2">Repeat locations</h2>
            {d.repeats.map((r) => (
              <div key={r.place} className="flex justify-between gap-3 py-2 border-b border-white/5 last:border-0 text-sm">
                <div><p>{r.place}</p><p className="muted text-xs">{r.note}</p></div>
                <span className="text-pumpkin font-medium">{r.count}x</span>
              </div>
            ))}
          </div>
          <div className="card border-witch/30">
            <h2 className="h-display text-lg mb-2 flex items-center gap-2"><span aria-hidden="true">👻</span>AI summary</h2>
            <p className="text-sm muted leading-relaxed">{d.summary}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
