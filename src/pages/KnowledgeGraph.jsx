import GraphVisualization from '../components/GraphVisualization'

const RELS = ['HAS_ISSUE', 'AFFECTS', 'LOCATED_IN', 'MAINTAINED_BY', 'ASSIGNED', 'DEPENDS_ON', 'COORDINATES_WITH']

export default function KnowledgeGraph() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-display text-3xl">Jurisdiction graph</h1>
        <p className="muted text-sm mt-1 max-w-2xl">
          How one complaint connects to the assets, authorities and actions around it. Every ownership link carries a source and a verification date.
        </p>
      </div>
      <GraphVisualization />
      <div className="card">
        <p className="font-medium text-sm mb-2">Relationships in this graph</p>
        <div className="flex flex-wrap gap-2">{RELS.map((r) => <code key={r} className="badge border-white/10 text-bone/70">{r}</code>)}</div>
        <p className="muted text-xs mt-3">Graph data is a small synthetic sample. It will come from Amazon Neptune through GET /graph/:complaintId.</p>
      </div>
    </div>
  )
}
