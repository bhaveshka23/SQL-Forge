import { Link } from 'react-router-dom'

function DashboardHome() {
  const metrics = [
    { label: 'Queries Executed', value: '142', change: '+12 today' },
    { label: 'Problems Solved', value: '28 / 500', change: '5.6% completed' },
    { label: 'Average Speed', value: '14.2ms', change: 'In-browser engine' },
    { label: 'Accuracy Score', value: '94.8%', change: 'Top 8% rank' },
  ]

  const recentDrills = [
    {
      id: '01',
      title: 'Top 3 Performers by Department',
      category: 'Window Functions',
      difficulty: 'Medium',
      status: 'Solved',
      time: '2 hours ago',
    },
    {
      id: '02',
      title: 'Management Hierarchy Tree Traversal',
      category: 'Recursive CTEs',
      difficulty: 'Hard',
      status: 'In Progress',
      time: 'Yesterday',
    },
    {
      id: '03',
      title: '30-Minute Inactivity Window Flagging',
      category: 'Sessionization',
      difficulty: 'Hard',
      status: 'Not Started',
      time: '2 days ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-forge-border bg-forge-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-forge-accent">
              Workspace Overview
            </div>
            <h1 className="mt-1 font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight text-forge-text">
              Welcome back, Engineer
            </h1>
            <p className="mt-1.5 text-sm text-forge-muted max-w-2xl">
              Your SQL practice environment is ready. Pick up where you left off or explore new challenges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/drills"
              className="inline-flex items-center gap-2 rounded-lg border border-forge-accent bg-forge-accent px-4 py-2.5 text-sm font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
            >
              <span>Practice MySQL</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-forge-border bg-forge-card p-5 transition-colors hover:border-forge-accent/60 shadow-xs"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-forge-muted">
              {m.label}
            </div>
            <div className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-forge-text">
              {m.value}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-forge-muted">
              <span>{m.change}</span>
              <span className="text-forge-success font-medium">● Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Drills & Active Practice Table */}
      <div className="rounded-xl border border-forge-border bg-forge-card overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-forge-border bg-forge-card-alt/50 px-5 py-4">
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-forge-text">
              Recent Practice Questions
            </h2>
            <p className="text-xs text-forge-muted mt-0.5">
              Challenges you recently viewed or worked on
            </p>
          </div>
          <Link
            to="/dashboard/drills"
            className="text-xs font-semibold text-forge-accent hover:underline"
          >
            View All Questions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-forge-border bg-forge-surface text-[11px] font-semibold uppercase tracking-wider text-forge-muted">
                <th className="p-4">#</th>
                <th className="p-4">Title</th>
                <th className="p-4">Topic</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-border text-forge-text">
              {recentDrills.map((drill) => (
                <tr key={drill.id} className="hover:bg-forge-card-alt/50 transition-colors">
                  <td className="p-4 font-mono text-forge-muted">{drill.id}</td>
                  <td className="p-4 font-semibold text-forge-text">{drill.title}</td>
                  <td className="p-4 text-forge-muted">{drill.category}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        drill.difficulty === 'Hard'
                          ? 'border-forge-accent/40 text-forge-accent bg-forge-accent/10'
                          : 'border-yellow-500/40 text-yellow-500 bg-yellow-500/10'
                      }`}
                    >
                      {drill.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium flex items-center gap-1.5 ${
                        drill.status === 'Solved'
                          ? 'text-forge-success'
                          : drill.status === 'In Progress'
                          ? 'text-forge-accent'
                          : 'text-forge-muted'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {drill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to="/dashboard/drills"
                      className="inline-block rounded-md border border-forge-border bg-forge-surface px-3 py-1 text-xs font-medium text-forge-muted hover:border-forge-accent hover:text-forge-accent transition-colors"
                    >
                      Solve
                    </Link>
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
