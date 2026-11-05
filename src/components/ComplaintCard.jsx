import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const TONES = {
  'In coordination': 'bg-pumpkin/15 text-pumpkin border-pumpkin/30',
  Assigned: 'bg-witch/15 text-purple-300 border-witch/30',
  'Awaiting verification': 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Resolved: 'bg-slime/10 text-slime border-slime/30',
}

export const StatusBadge = ({ status }) => (
  <span className={`badge ${TONES[status] || 'border-white/10 text-bone/70'}`}>{status}</span>
)

export default function ComplaintCard({ c }) {
  return (
    <Link to={`/complaints/${c.id}`} className="card block hover:border-pumpkin/40 transition">
      <div className="flex items-center justify-between gap-2">
        <span className="muted text-xs">{c.id} · filed {c.filed}</span>
        <StatusBadge status={c.status} />
      </div>
      <h3 className="h-display text-lg mt-2 leading-snug">{c.title}</h3>
      <p className="muted text-sm mt-1 flex items-center gap-1"><MapPin size={14} />{c.locality}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {c.departments.map((d) => <span key={d} className="badge border-white/10 text-bone/70">{d}</span>)}
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden" role="progressbar" aria-valuenow={c.stage} aria-valuemax={6}>
        <div className="h-full rounded-full bg-gradient-to-r from-witch to-pumpkin" style={{ width: `${(c.stage / 6) * 100}%` }} />
      </div>
    </Link>
  )
}
