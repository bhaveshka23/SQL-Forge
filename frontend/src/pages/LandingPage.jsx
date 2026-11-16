import { useState } from 'react'
import { Link } from 'react-router-dom'

// Simple, clear mock challenges for the interactive drill section
const CHALLENGES = [
  {
    id: '01',
    category: 'Window Functions',
    title: 'Find Top 3 Highest Earners Per Department',
    difficulty: 'Medium',
    runtimeLimit: '50ms',
    file: 'top_department_salaries.sql',
    dialect: 'PostgreSQL 16',
    description:
      'Write a query to find the top 3 highest-paid employees in each department. If two employees earn the same salary, assign them the same rank.',
    schema: 'employees (id, name, department, salary, status)',
    sql: `-- Find top 3 earners in each department, handling ties
WITH ranked_salaries AS (
  SELECT
    e.name AS employee_name,
    d.dept_name AS department,
    e.salary,
    DENSE_RANK() OVER (
      PARTITION BY e.department_id 
      ORDER BY e.salary DESC
    ) AS salary_rank
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE e.status = 'ACTIVE'
)
SELECT employee_name, department, salary, salary_rank
FROM ranked_salaries
WHERE salary_rank <= 3
ORDER BY department ASC, salary_rank ASC;`,
    output: [
      { col1: 'Elena Vance', col2: 'Engineering', col3: '$195,000', col4: '1' },
      { col1: 'Marcus Chen', col2: 'Engineering', col3: '$182,000', col4: '2' },
      { col1: 'Tariq Mansoor', col2: 'Engineering', col3: '$178,000', col4: '3' },
      { col1: 'Aria Thorne', col2: 'Security', col3: '$210,000', col4: '1' },
      { col1: 'Devon Miller', col2: 'Security', col3: '$198,000', col4: '2' },
    ],
    columns: ['employee_name', 'department', 'salary', 'salary_rank'],
    stats: { executionTime: '12ms', costScore: 'Optimal' },
  },
  {
    id: '02',
    category: 'Recursive CTEs',
    title: 'Company Org Hierarchy & Reporting Chain',
    difficulty: 'Hard',
    runtimeLimit: '80ms',
    file: 'company_org_hierarchy.sql',
    dialect: 'PostgreSQL 16',
    description:
      'Build a query that traverses an employee organization chart to show who reports to whom, from the VP down to junior developers.',
    schema: 'employees (id, name, manager_id, job_title)',
    sql: `-- Trace reporting chain from leadership to every employee
WITH RECURSIVE org_tree AS (
  SELECT 
    id,
    job_title,
    1 AS level,
    CAST(job_title AS TEXT) AS reporting_chain
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT 
    child.id,
    child.job_title,
    parent.level + 1,
    parent.reporting_chain || ' -> ' || child.job_title
  FROM employees child
  JOIN org_tree parent ON child.manager_id = parent.id
)
SELECT id, job_title, level, reporting_chain
FROM org_tree
ORDER BY level ASC, id ASC;`,
    output: [
      { col1: '101', col2: 'VP of Engineering', col3: 'Level 1', col4: 'VP of Engineering' },
      { col1: '204', col2: 'Engineering Manager', col3: 'Level 2', col4: 'VP -> Engineering Manager' },
      { col1: '309', col2: 'Senior Developer', col3: 'Level 3', col4: 'VP -> Manager -> Senior Dev' },
      { col1: '412', col2: 'Junior Developer', col3: 'Level 4', col4: 'VP -> Manager -> Senior -> Junior' },
    ],
    columns: ['employee_id', 'job_title', 'level', 'reporting_chain'],
    stats: { executionTime: '16ms', costScore: 'Optimal' },
  },
  {
    id: '03',
    category: 'User Activity',
    title: 'Group Website Visits Into Inactivity Sessions',
    difficulty: 'Hard',
    runtimeLimit: '60ms',
    file: 'user_session_split.sql',
    dialect: 'PostgreSQL 16',
    description:
      'Organize website clicks into user sessions. Start a new session whenever a user has been inactive for more than 30 minutes.',
    schema: 'user_clicks (user_id, event_time, page_name)',
    sql: `-- Create a new session after 30 minutes of inactivity
WITH inactivity_check AS (
  SELECT
    user_id,
    event_time,
    CASE 
      WHEN EXTRACT(EPOCH FROM (event_time - LAG(event_time) OVER (
        PARTITION BY user_id ORDER BY event_time
      ))) / 60 > 30 THEN 1 
      ELSE 0 
    END AS new_session_started
  FROM user_clicks
)
SELECT 
  user_id,
  event_time,
  SUM(new_session_started) OVER (
    PARTITION BY user_id ORDER BY event_time
  ) + 1 AS session_number
FROM inactivity_check;`,
    output: [
      { col1: 'user_401', col2: '10:00 AM', col3: 'Session 1', col4: 'Logged In' },
      { col1: 'user_401', col2: '10:15 AM', col3: 'Session 1', col4: 'Viewed Product' },
      { col1: 'user_401', col2: '11:10 AM', col3: 'Session 2', col4: 'Returned After Break' },
      { col1: 'user_401', col2: '11:20 AM', col3: 'Session 2', col4: 'Checked Out' },
    ],
    columns: ['user_id', 'event_time', 'session_id', 'activity'],
    stats: { executionTime: '14ms', costScore: 'Optimal' },
  },
]

function LandingPage() {
  // Hero Interactive Terminal State
  const [heroDialect, setHeroDialect] = useState('PostgreSQL 16')
  const [isRunningHero, setIsRunningHero] = useState(false)
  const [heroExecutionState, setHeroExecutionState] = useState('READY')
  const [queryExecutionCount, setQueryExecutionCount] = useState(1428580)

  // Interactive Drill Selector State
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(0)
  const currentDrill = CHALLENGES[selectedDrillIndex]

  const handleRunHeroQuery = () => {
    setIsRunningHero(true)
    setHeroExecutionState('RUNNING')
    setTimeout(() => {
      setIsRunningHero(false)
      setHeroExecutionState('SUCCESS')
      setQueryExecutionCount((prev) => prev + 1)
    }, 500)
  }

  return (
    <div className="relative min-h-screen bg-forge-bg text-forge-text transition-colors duration-200">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col lg:col-span-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forge-border bg-forge-surface px-3 py-1 text-xs font-medium text-forge-accent w-fit">
              <span className="h-2 w-2 rounded-full bg-forge-accent" />
              <span>Interactive SQL Practice Platform</span>
            </div>

            <h1 className="font-['Space_Grotesk'] text-4xl font-extrabold tracking-tight text-forge-text sm:text-6xl">
              Don't just learn SQL.
              <br />
              <span className="text-forge-accent">Master real skills.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-forge-muted leading-relaxed">
              Write queries. Solve real-world challenges. Build the confidence to succeed in technical interviews.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg border border-forge-accent bg-forge-accent px-6 py-3 text-sm font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover shadow-xs"
              >
                <span>Start Practicing Free</span>
                <span aria-hidden="true">→</span>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-forge-border bg-forge-surface px-5 py-3 text-sm font-medium text-forge-text transition-colors hover:bg-forge-card-alt"
              >
                <span>Explore Features</span>
                <span className="text-xs text-forge-muted">↓</span>
              </a>
            </div>

            {/* Quick Specs */}
            <div className="mt-12 border-t border-forge-border pt-6">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-medium text-forge-muted uppercase tracking-wider text-[11px]">Databases</div>
                  <div className="mt-1 font-semibold text-forge-text">Postgres & MySQL</div>
                </div>
                <div>
                  <div className="font-medium text-forge-muted uppercase tracking-wider text-[11px]">Challenges</div>
                  <div className="mt-1 font-semibold text-forge-text">500+ Practice Drills</div>
                </div>
                <div>
                  <div className="font-medium text-forge-muted uppercase tracking-wider text-[11px]">Setup Time</div>
                  <div className="mt-1 font-semibold text-forge-success">Instant in Browser</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor Preview */}
          <div className="w-full lg:col-span-6">
            <div className="rounded-2xl border border-forge-border bg-forge-surface shadow-xl overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-forge-border bg-forge-card-alt px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs font-medium text-forge-text">
                    monthly_user_retention.sql
                  </span>
                </div>

                {/* Dialect Switcher Pills */}
                <div className="flex items-center gap-1 text-xs">
                  {['PostgreSQL 16', 'MySQL 8.4', 'DuckDB'].map((dialect) => (
                    <button
                      key={dialect}
                      type="button"
                      onClick={() => setHeroDialect(dialect)}
                      className={`rounded px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                        heroDialect === dialect
                          ? 'bg-forge-accent/15 text-forge-accent font-semibold'
                          : 'text-forge-muted hover:text-forge-text'
                      }`}
                    >
                      {dialect}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Workspace & Code */}
              <div className="overflow-x-auto bg-[#101114] p-4 font-mono text-xs leading-6 text-[#F4F1EA]">
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                  <div className="select-none text-right text-[#92949B]/40">
                    <div>01</div>
                    <div>02</div>
                    <div>03</div>
                    <div>04</div>
                    <div>05</div>
                    <div>06</div>
                    <div>07</div>
                    <div>08</div>
                  </div>

                  <div>
                    <div className="text-[#92949B]">-- Count active users returning each month</div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">WITH</span> monthly_activity <span className="font-bold text-[#FF6B35]">AS</span> (
                    </div>
                    <div className="pl-4">
                      <span className="font-bold text-[#FF6B35]">SELECT</span> user_id,
                    </div>
                    <div className="pl-6">
                      <span className="text-[#38BDF8]">DATE_TRUNC</span>('month', visit_date) <span className="font-bold text-[#FF6B35]">AS</span> active_month
                    </div>
                    <div className="pl-4">
                      <span className="font-bold text-[#FF6B35]">FROM</span> user_activity
                    </div>
                    <div>)</div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">SELECT</span> active_month, <span className="text-[#38BDF8]">COUNT</span>(DISTINCT user_id) <span className="font-bold text-[#FF6B35]">AS</span> users
                    </div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">FROM</span> monthly_activity <span className="font-bold text-[#FF6B35]">GROUP BY</span> active_month;
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between border-t border-forge-border bg-forge-card-alt px-4 py-2.5 text-xs text-forge-muted">
                <span>Dialect: {heroDialect}</span>

                <button
                  type="button"
                  onClick={handleRunHeroQuery}
                  disabled={isRunningHero}
                  className="rounded-lg inline-flex items-center gap-2 border border-forge-accent bg-forge-accent px-3 py-1 text-xs font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover cursor-pointer"
                >
                  {isRunningHero ? 'Running Query...' : '▶ Run Query'}
                </button>
              </div>

              {/* Terminal Execution Result */}
              <div className="border-t border-forge-border bg-forge-surface p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-forge-success font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-forge-success" />
                    {heroExecutionState === 'RUNNING'
                      ? 'Executing query...'
                      : '✓ Query successful: 3 rows returned (14ms)'}
                  </span>
                  <span className="text-forge-muted">All tests passed</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-forge-border bg-forge-card-alt">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-forge-border bg-forge-surface text-[10px] uppercase text-forge-muted">
                        <th className="px-3 py-2">active_month</th>
                        <th className="px-3 py-2">total_users</th>
                        <th className="px-3 py-2">retention</th>
                        <th className="px-3 py-2">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forge-border text-forge-text">
                      <tr>
                        <td className="px-3 py-1.5 text-forge-accent">August 2026</td>
                        <td className="px-3 py-1.5">14,208</td>
                        <td className="px-3 py-1.5">88.4%</td>
                        <td className="px-3 py-1.5 text-forge-success font-semibold">PASSED</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 text-forge-accent">September 2026</td>
                        <td className="px-3 py-1.5">18,940</td>
                        <td className="px-3 py-1.5">91.2%</td>
                        <td className="px-3 py-1.5 text-forge-success font-semibold">PASSED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STATS COUNTER STRIP                                                       */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-y border-forge-border bg-forge-surface/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            <div className="border-l-2 border-forge-accent pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                {queryExecutionCount.toLocaleString()}+
              </div>
              <div className="mt-1 text-xs text-forge-muted">Queries Run by Users</div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                500+
              </div>
              <div className="mt-1 text-xs text-forge-muted">Practice Questions</div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-success">
                &lt; 18ms
              </div>
              <div className="mt-1 text-xs text-forge-muted">Average Run Speed</div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                100%
              </div>
              <div className="mt-1 text-xs text-forge-muted">Real Database Output</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURES SECTION                                                          */}
      {/* ========================================================================= */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-forge-accent">
            Features
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-4xl">
            Everything you need to master SQL.
          </h2>
          <p className="mt-3 text-base text-forge-muted leading-relaxed">
            Practice by writing real queries on realistic company schemas, receiving immediate feedback and test validation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs hover:border-forge-accent/60 transition-colors">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Run Real SQL in Your Browser
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Start typing SQL immediately. No need to install database servers, configure Docker, or troubleshoot connection strings.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs hover:border-forge-accent/60 transition-colors">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Real Tech Interview Questions
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Practice questions asked by top tech teams. Learn how to handle tricky edge cases like NULLs, duplicate rows, and tied rankings.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs hover:border-forge-accent/60 transition-colors">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Query Speed & Performance
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              See execution times and understand how indexes, joins, and filters impact query performance at scale.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs hover:border-forge-accent/60 transition-colors">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Multi-Dialect Support
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Switch easily between PostgreSQL, MySQL, DuckDB, and SQLite with one click so you feel comfortable with any stack.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs hover:border-forge-accent/60 transition-colors lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Realistic Enterprise Schemas
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Explore interconnected relational databases with real-world tables: employees, departments, orders, customers, reviews, and payment ledgers.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRACTICE DRILLS SECTION                                                   */}
      {/* ========================================================================= */}
      <section id="practice" className="relative z-10 border-t border-forge-border bg-forge-surface/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-forge-accent">
                Sample Practice Drills
              </div>
              <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-4xl">
                See what you will practice.
              </h2>
            </div>
            <div className="text-xs text-forge-muted">
              Select a category tab to inspect the query and expected output
            </div>
          </div>

          {/* Drill Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-forge-border pb-4">
            {CHALLENGES.map((challenge, index) => (
              <button
                key={challenge.id}
                type="button"
                onClick={() => setSelectedDrillIndex(index)}
                className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                  selectedDrillIndex === index
                    ? 'border-forge-accent bg-forge-card text-forge-accent font-semibold shadow-xs'
                    : 'border-forge-border bg-forge-surface text-forge-muted hover:text-forge-text'
                }`}
              >
                <span>{challenge.category}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    challenge.difficulty === 'Hard'
                      ? 'border-forge-accent/40 text-forge-accent'
                      : 'border-yellow-500/40 text-yellow-500'
                  }`}
                >
                  {challenge.difficulty}
                </span>
              </button>
            ))}
          </div>

          {/* Drill Workbench View */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-forge-border bg-forge-card p-6 lg:col-span-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between text-xs text-forge-muted border-b border-forge-border pb-3">
                  <span>Question #{currentDrill.id}</span>
                  <span className="text-forge-accent font-mono">Limit: {currentDrill.runtimeLimit}</span>
                </div>

                <h3 className="mt-4 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
                  {currentDrill.title}
                </h3>

                <p className="mt-3 text-sm text-forge-muted leading-relaxed">
                  {currentDrill.description}
                </p>

                <div className="mt-6 rounded-xl border border-forge-border bg-forge-card-alt p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-forge-accent">
                    Target Tables
                  </div>
                  <div className="mt-1 font-mono text-xs text-forge-text">
                    {currentDrill.schema}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-forge-border">
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-forge-accent bg-forge-accent py-2.5 text-xs font-semibold text-[#101114] hover:bg-forge-accent-hover transition-colors"
                >
                  <span>Solve This in Live Sandbox</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Right Card */}
            <div className="rounded-2xl border border-forge-border bg-forge-card lg:col-span-7 overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-forge-border bg-forge-card-alt px-4 py-2 text-xs font-mono">
                <span className="text-forge-text">{currentDrill.file}</span>
                <span className="text-forge-success">{currentDrill.dialect}</span>
              </div>

              <div className="overflow-x-auto bg-[#101114] p-4 font-mono text-xs leading-6 text-[#F4F1EA]">
                <pre className="whitespace-pre-wrap">{currentDrill.sql}</pre>
              </div>

              <div className="flex items-center justify-between border-y border-forge-border bg-forge-card-alt px-4 py-2 text-xs">
                <span className="text-forge-success font-semibold">
                  ✓ Execution Time: {currentDrill.stats.executionTime}
                </span>
                <span className="text-forge-muted">Rating: {currentDrill.stats.costScore}</span>
              </div>

              <div className="overflow-x-auto p-4 font-mono text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-forge-border text-[10px] uppercase text-forge-muted">
                      {currentDrill.columns.map((col) => (
                        <th key={col} className="pb-2 pr-4 font-normal">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-border text-forge-text">
                    {currentDrill.output.map((row, i) => (
                      <tr key={i}>
                        <td className="py-1.5 pr-4 text-forge-accent">{row.col1}</td>
                        <td className="py-1.5 pr-4">{row.col2}</td>
                        <td className="py-1.5 pr-4 text-forge-success">{row.col3}</td>
                        <td className="py-1.5 pr-4 font-semibold text-forge-accent">{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-forge-accent">
            How It Works
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-4xl">
            Build SQL confidence in 3 steps.
          </h2>
          <p className="mt-3 max-w-xl text-base text-forge-muted">
            A simple process to help you progress from basic queries to solving advanced interview questions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs">
            <div className="font-['Space_Grotesk'] text-4xl font-extrabold text-forge-border">
              01
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-forge-accent">
              Step 1: Understand
            </div>
            <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Read the Problem & Tables
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Review the question specs, inspect available table columns and foreign keys, and understand what output is expected.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs">
            <div className="font-['Space_Grotesk'] text-4xl font-extrabold text-forge-border">
              02
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-forge-accent">
              Step 2: Write & Run
            </div>
            <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Write and Test Queries
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Type your query in the built-in editor with syntax highlighting. Hit "Run Query" anytime to view intermediate outputs.
            </p>
          </div>

          <div className="rounded-2xl border border-forge-border bg-forge-card p-6 shadow-xs">
            <div className="font-['Space_Grotesk'] text-4xl font-extrabold text-forge-border">
              03
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-forge-success">
              Step 3: Verify
            </div>
            <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-bold text-forge-text">
              Pass Tricky Edge Cases
            </h3>
            <p className="mt-2 text-sm text-forge-muted leading-relaxed">
              Your solution is verified against datasets containing NULL values, duplicate keys, and ranking ties to ensure accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA SECTION                                                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-forge-border bg-forge-card p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-forge-accent">
              Ready to Practice?
            </div>

            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight text-forge-text sm:text-5xl">
              Start practicing SQL in seconds.
            </h2>

            <p className="mt-4 text-base text-forge-muted leading-relaxed">
              Choose a challenge, write your query, and see instant results directly in your browser. Free forever, no credit card required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg border border-forge-accent bg-forge-accent px-6 py-3 text-sm font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover shadow-xs"
              >
                <span>Create Free Account</span>
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-forge-border bg-forge-surface px-6 py-3 text-sm font-medium text-forge-text transition-colors hover:bg-forge-card-alt"
              >
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
