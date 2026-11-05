import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Mic, Sparkles, Check, Loader2, ShieldCheck } from 'lucide-react'
import { analyseComplaint } from '../services/api'
import { GhostCop, Pumpkin } from '../components/Spooky'

const STEPS = ['Understanding your complaint', 'Retrieving official records', 'Checking the responsibility graph', 'Drafting a coordination plan']
const DEMO = 'There is waterlogging on the road near our colony. The drainage system is overflowing and the road has started breaking. I have complained several times and nothing has been fixed.'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export default function SubmitComplaint() {
  const nav = useNavigate()
  const [text, setText] = useState('')
  const [locality, setLocality] = useState('')
  const [photo, setPhoto] = useState(null)
  const [stage, setStage] = useState(-1)
  const [result, setResult] = useState(null)
  const running = stage >= 0 && stage < STEPS.length

  const run = async () => {
    setResult(null)
    const pending = analyseComplaint({ description: text, locality })
    for (let i = 0; i < STEPS.length; i++) { setStage(i); await wait(850) }
    setResult(await pending)
    setStage(STEPS.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Pumpkin size={52} className="animate-flicker" />
        <div>
          <h1 className="h-display text-3xl">Report an issue</h1>
          <p className="muted text-sm mt-1">Describe the problem in your own words. We will work out who needs to act.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="card space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="desc" className="text-sm font-medium">What is happening?</label>
              <button type="button" onClick={() => { setText(DEMO); setLocality('Demo Locality, Delhi') }} className="text-xs text-pumpkin hover:underline">Use demo complaint</button>
            </div>
            <textarea id="desc" rows={6} className="input" placeholder="Water is overflowing from the drain near my colony..." value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label htmlFor="loc" className="text-sm font-medium block mb-1.5">Location</label>
            <input id="loc" className="input" placeholder="Locality or landmark" value={locality} onChange={(e) => setLocality(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="btn-ghost cursor-pointer">
              <Upload size={16} />{photo ? photo.name : 'Add a photo'}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files[0])} />
            </label>
            <button type="button" className="btn-ghost" disabled title="Voice input comes later"><Mic size={16} />Voice (coming soon)</button>
          </div>
          {photo && <img src={URL.createObjectURL(photo)} alt="Complaint attachment preview" className="rounded-xl max-h-48 border border-white/10" />}
          <button className="btn-primary w-full" disabled={!text.trim() || running} onClick={run}>
            {running ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {running ? 'Analysing...' : 'Analyse complaint'}
          </button>
        </div>

        <div className="card min-h-[22rem] relative overflow-hidden">
          {stage < 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 muted">
              <GhostCop size={130} className="animate-bob" />
              <p className="mt-3 text-bone/80">Officer Boo is waiting for your report.</p>
              <p className="text-xs mt-1">Add a description and select Analyse complaint.</p>
              <div className="flex items-end gap-2 mt-4"><Pumpkin size={44} /><Pumpkin size={64} /><Pumpkin size={44} face={false} /></div>
            </div>
          )}

          {stage >= 0 && (
            <ul className="space-y-2 mb-5" aria-live="polite">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 text-sm ${i > stage ? 'text-bone/30' : ''}`}>
                  {i < stage ? <Check size={15} className="text-slime" /> : i === stage ? <Loader2 size={15} className="animate-spin text-pumpkin" /> : <span className="w-[15px]" />}
                  {s}
                </li>
              ))}
            </ul>
          )}

          {result && (
            <div className="space-y-5 border-t border-pumpkin/10 pt-5">
              <div className="flex items-center gap-3 rounded-xl bg-pumpkin/10 border border-pumpkin/30 p-3">
                <GhostCop size={52} className="shrink-0" />
                <p className="text-sm">Officer Boo found {result.issues.length} connected {result.issues.length === 1 ? 'issue' : 'issues'} in your report.</p>
              </div>
              <div>
                <p className="muted text-xs mb-1.5">Issues found</p>
                <div className="flex flex-wrap gap-2">{result.issues.map((i) => <span key={i} className="badge border-pumpkin/40 text-pumpkin bg-pumpkin/10">{i}</span>)}</div>
                <p className="muted text-xs mt-3 mb-1.5">Assets involved</p>
                <div className="flex flex-wrap gap-2">{result.assets.map((a) => <span key={a} className="badge border-witch/40 text-purple-300 bg-witch/10">{a}</span>)}</div>
              </div>

              <div>
                <p className="muted text-xs mb-2">Authorities that may be responsible</p>
                <div className="space-y-3">
                  {result.departments.map((d) => (
                    <div key={d.name} className="rounded-xl bg-night/60 border border-white/5 p-3">
                      <div className="flex justify-between text-sm"><span className="font-medium">{d.name}</span><span className="text-pumpkin">{Math.round(d.confidence * 100)}%</span></div>
                      <p className="muted text-xs">{d.role}</p>
                      <div className="h-1 rounded-full bg-white/5 mt-2"><div className="h-full rounded-full bg-gradient-to-r from-witch to-pumpkin" style={{ width: `${d.confidence * 100}%` }} /></div>
                      <p className="text-xs text-slime mt-2">Evidence: {d.evidence}</p>
                    </div>
                  ))}
                </div>
                <p className="muted text-xs mt-2">Confidence is a model estimate, not proof of jurisdiction.</p>
              </div>

              <div className="text-sm">
                <p className="muted text-xs mb-1">Order of work</p>
                {result.dependencies.map((d, i) => <p key={i}>{d.first} <span className="text-pumpkin">then</span> {d.next}</p>)}
              </div>

              {result.requires_human_approval && (
                <div className="flex gap-2 rounded-xl border border-witch/30 bg-witch/10 p-3 text-sm">
                  <ShieldCheck size={18} className="text-purple-300 shrink-0" />
                  <p>An authorised officer will verify this before it is routed. AI suggestions never override official records.</p>
                </div>
              )}
              <button className="btn-primary w-full" onClick={() => nav(`/complaints/${result.complaint_id}`)}>Submit for officer verification</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
