import { useState } from 'react'
import { Inbox, Clock, Lock, Flag, Upload, Check } from 'lucide-react'
import { tasks as seed } from '../data/mock'
import StatCard from '../components/StatCard'

const TONE = {
  'Awaiting acknowledgement': 'border-amber-400/30 text-amber-300 bg-amber-400/10',
  Acknowledged: 'border-slime/30 text-slime bg-slime/10',
  'Blocked by dependency': 'border-white/15 text-bone/60 bg-white/5',
  Disputed: 'border-red-400/30 text-red-300 bg-red-500/10',
  Completed: 'border-slime/30 text-slime bg-slime/10',
}

export default function DepartmentDashboard() {
  const [tasks, setTasks] = useState(seed)
  const set = (id, status) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x)))
  const n = (s) => tasks.filter((t) => t.status === s).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-display text-3xl">Task queue</h1>
        <p className="muted text-sm mt-1">Road Authority (demo). Actions that wait on another department are marked.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open tasks" value={tasks.length - n('Completed')} icon={Inbox} />
        <StatCard label="Need acknowledgement" value={n('Awaiting acknowledgement')} icon={Clock} tone="warn" />
        <StatCard label="Blocked by dependency" value={n('Blocked by dependency')} icon={Lock} />
        <StatCard label="Disputed" value={n('Disputed')} icon={Flag} tone="warn" />
      </div>

      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="muted text-xs">{t.id} · complaint {t.complaint} · due {t.due}{t.overdue && <span className="text-red-300"> · overdue for acknowledgement</span>}</p>
                <h3 className="h-display text-lg mt-1">{t.action}</h3>
                {t.dependsOn && <p className="text-sm text-pumpkin mt-1">Waiting on: {t.dependsOn}</p>}
              </div>
              <span className={`badge ${TONE[t.status]}`}>{t.status}</span>
            </div>

            {t.status === 'Awaiting acknowledgement' && (
              <div className="flex flex-wrap gap-3 mt-4">
                <button className="btn-primary" onClick={() => set(t.id, 'Acknowledged')}><Check size={15} />Acknowledge task</button>
                <button className="btn-ghost" onClick={() => set(t.id, 'Disputed')}><Flag size={15} />Not our asset</button>
              </div>
            )}
            {t.status === 'Acknowledged' && (
              <div className="flex flex-wrap gap-3 mt-4">
                <label className="btn-ghost cursor-pointer"><Upload size={15} />Upload completion evidence<input type="file" className="sr-only" onChange={() => set(t.id, 'Completed')} /></label>
              </div>
            )}
            {t.status === 'Disputed' && (
              <div className="mt-4 text-sm">
                <p className="muted mb-2">Attach the official ownership record. A nodal officer will review it before the graph changes.</p>
                <label className="btn-ghost cursor-pointer"><Upload size={15} />Upload ownership record<input type="file" className="sr-only" /></label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
