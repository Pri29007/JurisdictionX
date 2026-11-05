import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ThumbsUp, Flag } from 'lucide-react'
import { complaints, timeline } from '../data/mock'
import { StatusBadge } from '../components/ComplaintCard'
import WorkflowTimeline from '../components/WorkflowTimeline'
import GraphVisualization from '../components/GraphVisualization'

export default function ComplaintDetails() {
  const { id } = useParams()
  const c = complaints.find((x) => x.id === id) || complaints[0]
  const [verdict, setVerdict] = useState(null)

  return (
    <div className="space-y-6">
      <Link to="/citizen" className="muted text-sm inline-flex items-center gap-1 hover:text-pumpkin"><ArrowLeft size={14} />All complaints</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="muted text-sm">{c.id} · filed {c.filed}</p>
          <h1 className="h-display text-3xl max-w-3xl">{c.title}</h1>
          <p className="muted text-sm mt-2 flex items-center gap-1"><MapPin size={14} />{c.locality}</p>
        </div>
        <StatusBadge status={c.status} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="card lg:col-span-3">
          <h2 className="h-display text-lg mb-5">Progress</h2>
          <WorkflowTimeline steps={timeline} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="h-display text-lg mb-3">Who is involved</h2>
            {c.departments.map((d, i) => (
              <div key={d} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                <span>{d}</span><span className="muted text-xs">{i === 0 ? 'Primary' : 'Supporting'}</span>
              </div>
            ))}
            <p className="muted text-xs mt-3">Expected timeline appears here once your department sets an official one.</p>
          </div>
          <div className="card">
            <h2 className="h-display text-lg mb-1">Is it fixed?</h2>
            <p className="muted text-sm mb-4">Once work is marked complete, you confirm or dispute it.</p>
            {verdict ? (
              <p className={`text-sm ${verdict === 'confirm' ? 'text-slime' : 'text-pumpkin'}`}>
                {verdict === 'confirm' ? 'Thanks. Resolution confirmed.' : 'Dispute recorded. An officer will review the evidence.'}
              </p>
            ) : (
              <div className="flex gap-3">
                <button className="btn-primary flex-1" onClick={() => setVerdict('confirm')}><ThumbsUp size={15} />Confirm fix</button>
                <button className="btn-ghost flex-1" onClick={() => setVerdict('dispute')}><Flag size={15} />Dispute</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="h-display text-lg mb-3">Responsibility map</h2>
        <GraphVisualization />
      </div>
    </div>
  )
}
