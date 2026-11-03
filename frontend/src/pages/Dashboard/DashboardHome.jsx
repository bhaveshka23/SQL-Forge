import { Link } from 'react-router-dom'

function DashboardHome() {
  const metrics = [
    { label: 'QUERIES EXECUTED', value: '142', change: '+12 today', status: 'optimal' },
    { label: 'DRILLS SOLVED', value: '28 / 500', change: '5.6% complete', status: 'neutral' },
    { label: 'AVERAGE LATENCY', value: '14.2ms', change: 'WASM engine', status: 'optimal' },
    { label: 'ACCURACY SCORE', value: '94.8%', change: 'Top 8%', status: 'optimal' },
  ]

  const recentDrills = [
    {
      id: '01',
      title: 'Top 3 Performers by Department',
      category: 'WINDOW FUNCTIONS',
      difficulty: 'MEDIUM',
      status: 'SOLVED',
      time: '2 hours ago',
    },
    {
      id: '02',
      title: 'Management Hierarchy Tree Traversal',
      category: 'RECURSIVE CTE',
      difficulty: 'HARD',
      status: 'IN PROGRESS',
      time: 'Yesterday',
    },
    {
      id: '03',
      title: '30-Minute Inactivity Window Flagging',
      category: 'SESSIONIZATION',
      difficulty: 'HARD',
      status: 'QUEUED',
      time: '2 days ago',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative border border-forge-border bg-forge-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
              <span>WORKSPACE</span>
              <span className="text-forge-border">|</span>
              
            </div>
            <h1 className="mt-2 font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold tracking-tight text-forge-text">
              WELCOME BACK, ENGINEER_01.
            </h1>
            <p className="mt-1 font-['Inter'] text-sm text-forge-muted">
              Your in-browser PostgreSQL 16 WASM sandbox is loaded and ready.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/editor"
              className="inline-flex items-center gap-2 border border-forge-accent bg-forge-accent px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
            >
              <span>LAUNCH SQL EDITOR</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="border border-forge-border bg-forge-card p-5 transition-colors hover:border-forge-accent/60"
          >
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-forge-muted">
              {m.label}
            </div>
            <div className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-forge-text">
              {m.value}
            </div>
            <div className="mt-1 flex items-center justify-between font-['JetBrains_Mono'] text-[11px]">
              <span className="text-forge-muted">{m.change}</span>
              <span className="text-forge-success text-[10px]">● ACTIVE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Drills & Active Practice Table */}
      <div className="border border-forge-border bg-forge-card">
        <div className="flex items-center justify-between border-b border-forge-border bg-forge-card-alt px-5 py-3">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase text-forge-text">
            <span>RECENT PRACTICE DRILLS</span>
          </div>
          <Link
            to="/dashboard/drills"
            className="font-['JetBrains_Mono'] text-xs text-forge-accent hover:underline"
          >
            VIEW ALL DRILLS ↗
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-['JetBrains_Mono'] text-xs">
            <thead>
              <tr className="border-b border-forge-border bg-forge-surface text-[10px] uppercase text-forge-muted">
                <th className="p-4">ID</th>
                <th className="p-4">TITLE</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">DIFFICULTY</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-border text-forge-text">
              {recentDrills.map((drill) => (
                <tr key={drill.id} className="hover:bg-forge-card-alt/50 transition-colors">
                  <td className="p-4 text-forge-muted">#{drill.id}</td>
                  <td className="p-4 font-semibold text-forge-text">{drill.title}</td>
                  <td className="p-4 text-forge-muted">{drill.category}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 border ${
                        drill.difficulty === 'HARD'
                          ? 'border-forge-accent/40 text-forge-accent'
                          : 'border-forge-success/40 text-forge-success'
                      }`}
                    >
                      {drill.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[11px] font-semibold ${
                        drill.status === 'SOLVED'
                          ? 'text-forge-success'
                          : drill.status === 'IN PROGRESS'
                          ? 'text-forge-accent'
                          : 'text-forge-muted'
                      }`}
                    >
                      ● {drill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      className="border border-forge-border bg-forge-surface px-3 py-1 text-xs text-forge-muted hover:border-forge-accent hover:text-forge-accent transition-colors"
                    >
                      OPEN DRILL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

