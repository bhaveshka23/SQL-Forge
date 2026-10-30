import { useState } from 'react'
import { Link } from 'react-router-dom'

// Simple, clear mock challenges for the interactive drill section
const CHALLENGES = [
  {
    id: '01',
    category: 'WINDOW FUNCTIONS',
    title: 'Find Top 3 Highest Earners Per Department',
    difficulty: 'MEDIUM',
    runtimeLimit: '50ms',
    file: 'top_department_salaries.sql',
    dialect: 'PostgreSQL 16',
    description:
      'Write a query to find the top 3 highest-paid employees in each team. If two employees earn the same salary, give them the same rank.',
    schema: 'employees (id, name, department, salary, status)',
    sql: `-- Find top 3 earners in each team, handling ties fairly
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
    stats: { executionTime: '12ms', costScore: 'Good', memory: '1.8MB' },
  },
  {
    id: '02',
    category: 'RECURSIVE QUERIES',
    title: 'Show Company Org Chart & Managers',
    difficulty: 'HARD',
    runtimeLimit: '80ms',
    file: 'company_org_hierarchy.sql',
    dialect: 'PostgreSQL 16',
    description:
      'Build a query that walks down an employee list to show who reports to whom, starting from the VP all the way to junior team members.',
    schema: 'employees (id, name, manager_id, job_title)',
    sql: `-- Trace the reporting chain from VP to every employee
WITH RECURSIVE org_tree AS (
  -- Start with the top leader (no manager)
  SELECT 
    id,
    job_title,
    1 AS level,
    CAST(job_title AS TEXT) AS reporting_chain
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Connect each employee to their manager
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
    stats: { executionTime: '16ms', costScore: 'Optimal', memory: '2.4MB' },
  },
  {
    id: '03',
    category: 'USER ACTIVITY',
    title: 'Group Website Visits Into Sessions',
    difficulty: 'HARD',
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
    stats: { executionTime: '14ms', costScore: 'Good', memory: '2.1MB' },
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
      {/* Background Engineering Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 industrial-grid opacity-30" />

      {/* ========================================================================= */}
      {/* HERO SECTION: Asymmetrical Two-Column Industrial Layout                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Industrial Typography & Copy (6 cols) */}
          <div className="flex flex-col lg:col-span-6 xl:col-span-6">
            {/* Small Technical Label */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 border border-forge-border bg-forge-surface px-3 py-1 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
                <span className="h-1.5 w-1.5 bg-forge-accent" />
                INTERACTIVE SQL PRACTICE // 001
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-forge-muted">
                [RUNS IN YOUR BROWSER]
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Space_Grotesk'] text-4xl font-extrabold tracking-tight text-forge-text sm:text-6xl xl:text-7xl">
              DON'T JUST
              <br />
              LEARN SQL.
              <br />
              <span className="relative inline-block text-forge-accent">
                FORGE YOUR SKILLS.
                <span className="absolute -bottom-1 left-0 h-1 w-20 bg-forge-accent" />
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-8 max-w-xl font-['Inter'] text-lg font-normal leading-relaxed text-forge-muted">
              Write queries. Solve real-world challenges. Build the confidence to succeed in
              technical interviews.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-3 border border-forge-accent bg-forge-accent px-7 py-3.5 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
              >
                <span>START FORGING</span>
                <span className="text-base font-bold transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
                {/* Industrial Corner Notch */}
                <span className="absolute -top-1 -left-1 h-2 w-2 bg-forge-bg" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-forge-bg" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 border border-forge-border bg-forge-surface px-6 py-3.5 font-['JetBrains_Mono'] text-sm font-semibold uppercase tracking-wider text-forge-text transition-colors hover:border-forge-muted hover:bg-forge-card-alt"
              >
                <span>EXPLORE PLATFORM</span>
                <span className="text-xs text-forge-muted">↓</span>
              </a>
            </div>

            {/* Technical Metadata Footer */}
            <div className="mt-14 border-t border-forge-border pt-6">
              <div className="grid grid-cols-2 gap-4 font-['JetBrains_Mono'] text-xs sm:grid-cols-3">
                <div>
                  <div className="text-[10px] uppercase text-forge-muted">DATABASES</div>
                  <div className="mt-1 font-semibold text-forge-text">POSTGRES & MYSQL</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-forge-muted">INTERVIEW DRILLS</div>
                  <div className="mt-1 font-semibold text-forge-text">500+ PROBLEMS</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-forge-muted">SETUP TIME</div>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-forge-success">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-forge-success" />
                    ZERO // INSTANT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Industrial Terminal / Query Editor Preview (6 cols) */}
          <div className="w-full lg:col-span-6 xl:col-span-6">
            <div className="relative border border-forge-border bg-forge-surface shadow-2xl">
              {/* Corner Coordinate Badges */}
              <div className="absolute -top-2.5 -left-2.5 bg-forge-bg px-1 font-['JetBrains_Mono'] text-[9px] text-forge-muted">
                + 001.EDITOR
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 bg-forge-bg px-1 font-['JetBrains_Mono'] text-[9px] text-forge-muted">
                LIVE PREVIEW
              </div>

              {/* Terminal Title Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-forge-border bg-forge-card-alt px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 border border-forge-border bg-forge-accent" />
                    <span className="h-2.5 w-2.5 border border-forge-border bg-forge-border" />
                    <span className="h-2.5 w-2.5 border border-forge-border bg-forge-border" />
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs font-semibold text-forge-text">
                    monthly_user_retention.sql
                  </span>
                </div>

                {/* Dialect Switcher Pills */}
                <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[10px]">
                  {['PostgreSQL 16', 'MySQL 8.4', 'DuckDB'].map((dialect) => (
                    <button
                      key={dialect}
                      type="button"
                      onClick={() => setHeroDialect(dialect)}
                      className={`px-2 py-0.5 uppercase transition-colors ${
                        heroDialect === dialect
                          ? 'border border-forge-accent bg-forge-accent/15 text-forge-accent'
                          : 'border border-transparent text-forge-muted hover:text-forge-text'
                      }`}
                    >
                      {dialect}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Workspace & Syntax Highlighting (High-contrast code area) */}
              <div className="overflow-x-auto bg-[#101114] p-4 font-['JetBrains_Mono'] text-xs leading-6 text-[#F4F1EA]">
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                  {/* Line Numbers */}
                  <div className="select-none text-right font-['JetBrains_Mono'] text-[#92949B]/40">
                    <div>01</div>
                    <div>02</div>
                    <div>03</div>
                    <div>04</div>
                    <div>05</div>
                    <div>06</div>
                    <div>07</div>
                    <div>08</div>
                    <div>09</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                  </div>

                  {/* SQL Syntax Code */}
                  <div>
                    <div className="text-[#92949B]">
                      <span className="text-[#92949B]">-- Count active users returning each month</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">WITH</span>{' '}
                      <span className="text-[#F4F1EA]">monthly_activity</span>{' '}
                      <span className="font-bold text-[#FF6B35]">AS</span> (
                    </div>
                    <div className="pl-4">
                      <span className="font-bold text-[#FF6B35]">SELECT</span> user_id,
                    </div>
                    <div className="pl-6">
                      <span className="text-[#38BDF8]">DATE_TRUNC</span>
                      ('month', visit_date) <span className="font-bold text-[#FF6B35]">AS</span> active_month,
                    </div>
                    <div className="pl-6">
                      <span className="text-[#38BDF8]">DENSE_RANK</span>() <span className="font-bold text-[#FF6B35]">OVER</span> (
                    </div>
                    <div className="pl-8">
                      <span className="font-bold text-[#FF6B35]">PARTITION BY</span> user_id{' '}
                      <span className="font-bold text-[#FF6B35]">ORDER BY</span> visit_date
                    </div>
                    <div className="pl-6">) <span className="font-bold text-[#FF6B35]">AS</span> visit_count</div>
                    <div className="pl-4">
                      <span className="font-bold text-[#FF6B35]">FROM</span> user_activity
                    </div>
                    <div className="pl-4">
                      <span className="font-bold text-[#FF6B35]">WHERE</span> status ={' '}
                      <span className="text-[#52C788]">'ACTIVE'</span>
                    </div>
                    <div>)</div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">SELECT</span> active_month,{' '}
                      <span className="text-[#38BDF8]">COUNT</span>(<span className="font-bold text-[#FF6B35]">DISTINCT</span> user_id) <span className="font-bold text-[#FF6B35]">AS</span> total_users
                    </div>
                    <div>
                      <span className="font-bold text-[#FF6B35]">FROM</span> monthly_activity{' '}
                      <span className="font-bold text-[#FF6B35]">GROUP BY</span> active_month;
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between border-t border-forge-border bg-forge-card-alt px-4 py-2.5">
                <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
                  <span>DIALECT: {heroDialect.toUpperCase()}</span>
                  <span>|</span>
                  <span className="hidden sm:inline">READY TO RUN</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunHeroQuery}
                    disabled={isRunningHero}
                    className="inline-flex items-center gap-2 border border-forge-accent bg-forge-accent px-3.5 py-1.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover"
                  >
                    {isRunningHero ? (
                      <>
                        <span className="h-2 w-2 animate-spin rounded-full border-2 border-[#101114] border-t-transparent" />
                        <span>RUNNING QUERY...</span>
                      </>
                    ) : (
                      <>
                        <span>▶ RUN QUERY</span>
                        <span className="hidden text-[10px] text-[#101114]/75 sm:inline">[CLICK TO TEST]</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Terminal Execution Result Drawer */}
              <div className="border-t border-forge-border bg-forge-surface p-4">
                <div className="mb-2 flex items-center justify-between font-['JetBrains_Mono'] text-[11px]">
                  <span className="flex items-center gap-1.5 text-forge-success">
                    <span className="h-1.5 w-1.5 bg-forge-success" />
                    {heroExecutionState === 'RUNNING'
                      ? 'EXECUTING QUERY...'
                      : '✓ SUCCESS: 3 ROWS RETURNED (14MS)'}
                  </span>
                  <span className="text-forge-muted">STATUS: ALL TESTS PASSED</span>
                </div>

                {/* Result Table Preview */}
                <div className="overflow-x-auto border border-forge-border bg-forge-card-alt">
                  <table className="w-full text-left font-['JetBrains_Mono'] text-xs">
                    <thead>
                      <tr className="border-b border-forge-border bg-forge-surface text-[10px] uppercase tracking-wider text-forge-muted">
                        <th className="px-3 py-2">active_month</th>
                        <th className="px-3 py-2">total_users</th>
                        <th className="px-3 py-2">retention_rate</th>
                        <th className="px-3 py-2">result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forge-border text-forge-text">
                      <tr>
                        <td className="px-3 py-1.5 text-forge-accent">August 2026</td>
                        <td className="px-3 py-1.5">14,208</td>
                        <td className="px-3 py-1.5">88.4%</td>
                        <td className="px-3 py-1.5 text-forge-success">PASSED</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 text-forge-accent">September 2026</td>
                        <td className="px-3 py-1.5">18,940</td>
                        <td className="px-3 py-1.5">91.2%</td>
                        <td className="px-3 py-1.5 text-forge-success">PASSED</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 text-forge-accent">October 2026</td>
                        <td className="px-3 py-1.5">24,510</td>
                        <td className="px-3 py-1.5">94.8%</td>
                        <td className="px-3 py-1.5 text-forge-success">PASSED</td>
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
      {/* TELEMETRY METRIC STRIP: Clear, Simple Statistics                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-y border-forge-border bg-forge-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            <div className="border-l-2 border-forge-accent pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                {queryExecutionCount.toLocaleString()}+
              </div>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
                QUERIES RUN BY USERS
              </div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                500+
              </div>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
                PRACTICE QUESTIONS
              </div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-success">
                &lt; 18MS
              </div>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
                AVERAGE RUN SPEED
              </div>
            </div>

            <div className="border-l-2 border-forge-border pl-4">
              <div className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text">
                100%
              </div>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
                REAL DATABASE ACCURACY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 01: PLATFORM CORE FEATURES (Simple, Understandable)               */}
      {/* ========================================================================= */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
              <span>// 01 FEATURES</span>
              <span className="text-forge-border">|</span>
              <span className="text-forge-muted">WHY ENGINEERS USE IT</span>
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-5xl">
              HOW SQLFORGE HELPS YOU LEARN.
            </h2>
          </div>
          <p className="mt-4 max-w-md font-['Inter'] text-sm leading-relaxed text-forge-muted md:mt-0">
            No boring video lectures or fake multiple-choice questions. You learn by writing real
            queries and seeing instant results.
          </p>
        </div>

        {/* Asymmetrical Industrial Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: In-Browser Execution */}
          <div className="group relative border border-forge-border bg-forge-card p-8 transition-colors hover:border-forge-accent/60">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span>FEATURE_01</span>
              <span className="text-forge-accent">[NO SETUP NEEDED]</span>
            </div>
            <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Run Real SQL in Your Browser
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Start typing SQL immediately. You don't need to install MySQL, configure Docker, or
              deal with messy database connection errors.
            </p>
            <div className="mt-6 border-t border-forge-border pt-4 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              INSTANT RESULTS // ZERO INSTALLATION
            </div>
          </div>

          {/* Card 2: Interview Questions */}
          <div className="group relative border border-forge-border bg-forge-card p-8 transition-colors hover:border-forge-accent/60">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span>FEATURE_02</span>
              <span className="text-forge-success">[INTERVIEW-READY]</span>
            </div>
            <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Real Tech Company Interview Questions
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Practice the exact SQL questions asked by top tech companies. Learn how to handle
              tricky cases like missing data, duplicate rows, and tied rankings.
            </p>
            <div className="mt-6 border-t border-forge-border pt-4 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              COVERS: JOINS, CTEs, WINDOW FUNCTIONS & AGGREGATES
            </div>
          </div>

          {/* Card 3: Query Speed & Cost */}
          <div className="group relative border border-forge-border bg-forge-card p-8 transition-colors hover:border-forge-accent/60">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span>FEATURE_03</span>
              <span className="text-forge-accent">[SPEED & OPTIMIZATION]</span>
            </div>
            <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Learn How to Write Faster Queries
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Writing a query that works is good. Writing one that runs fast is even better. See
              execution time and understand how indexes make your queries quicker.
            </p>
            <div className="mt-6 border-t border-forge-border pt-4 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              UNDERSTAND: INDEXES // SCAN TYPES // EXECUTION TIME
            </div>
          </div>

          {/* Card 4: Multi-Dialect Support */}
          <div className="group relative border border-forge-border bg-forge-card p-8 transition-colors hover:border-forge-accent/60">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span>FEATURE_04</span>
              <span className="text-forge-muted">[POPULAR ENGINES]</span>
            </div>
            <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              PostgreSQL, MySQL & More
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Switch easily between different SQL dialects with one click so you are comfortable no
              matter which database your future team uses.
            </p>
            <div className="mt-6 border-t border-forge-border pt-4 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              SUPPORTED: POSTGRESQL // MYSQL // DUCKDB
            </div>
          </div>

          {/* Card 5: Real-World Datasets (Spans 2 cols on lg) */}
          <div className="group relative border border-forge-border bg-forge-card p-8 transition-colors hover:border-forge-accent/60 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span>FEATURE_05</span>
              <span className="text-forge-accent">[PRACTICAL DATA]</span>
            </div>
            <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Practical Company Datasets (Not Toy Examples)
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Instead of tiny tables with three rows, practice on realistic business data: user
              subscriptions, payments, e-commerce orders, and web activity logs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 font-['JetBrains_Mono'] text-xs">
              <span className="border border-forge-border bg-forge-surface px-2.5 py-1 text-forge-muted">
                #CUSTOMER_ORDERS
              </span>
              <span className="border border-forge-border bg-forge-surface px-2.5 py-1 text-forge-muted">
                #MONTHLY_PAYMENTS
              </span>
              <span className="border border-forge-border bg-forge-surface px-2.5 py-1 text-forge-muted">
                #APP_ANALYTICS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02: INTERACTIVE PRACTICE DRILLS                                    */}
      {/* ========================================================================= */}
      <section id="practice" className="relative z-10 border-t border-forge-border bg-forge-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
                <span>// 02 PRACTICE DRILLS</span>
                <span className="text-forge-border">|</span>
                <span className="text-forge-muted">SAMPLE QUESTIONS</span>
              </div>
              <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-5xl">
                SEE WHAT YOU WILL PRACTICE.
              </h2>
            </div>
            <div className="mt-4 font-['JetBrains_Mono'] text-xs text-forge-muted md:mt-0">
              CLICK A TAB TO VIEW THE QUESTION, QUERY & OUTPUT
            </div>
          </div>

          {/* Drill Category Tabs */}
          <div className="mt-10 flex flex-wrap gap-2 border-b border-forge-border pb-4">
            {CHALLENGES.map((challenge, index) => (
              <button
                key={challenge.id}
                type="button"
                onClick={() => setSelectedDrillIndex(index)}
                className={`flex items-center gap-3 border px-4 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all ${
                  selectedDrillIndex === index
                    ? 'border-forge-accent bg-forge-card text-forge-accent shadow-sm'
                    : 'border-forge-border bg-forge-surface text-forge-muted hover:text-forge-text'
                }`}
              >
                <span className="text-[10px] opacity-60">0{index + 1}.</span>
                <span>{challenge.category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 border ${
                    challenge.difficulty === 'HARD'
                      ? 'border-forge-accent/40 text-forge-accent'
                      : 'border-forge-success/40 text-forge-success'
                  }`}
                >
                  {challenge.difficulty}
                </span>
              </button>
            ))}
          </div>

          {/* Drill Workbench View */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Challenge Metadata & Prompt (5 cols) */}
            <div className="flex flex-col justify-between border border-forge-border bg-forge-card p-6 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-forge-border pb-3">
                  <span className="font-['JetBrains_Mono'] text-xs text-forge-muted">
                    QUESTION #{currentDrill.id}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-forge-accent">
                    TIME LIMIT: {currentDrill.runtimeLimit}
                  </span>
                </div>

                <h3 className="mt-4 font-['Space_Grotesk'] text-2xl font-bold text-forge-text">
                  {currentDrill.title}
                </h3>

                <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
                  {currentDrill.description}
                </p>

                <div className="mt-6 border border-forge-border bg-forge-card-alt p-4">
                  <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-forge-accent">
                    TABLE STRUCTURE
                  </div>
                  <div className="mt-1 font-['JetBrains_Mono'] text-xs text-forge-text">
                    {currentDrill.schema}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-forge-border pt-4">
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 border border-forge-accent bg-forge-accent py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] hover:bg-forge-accent-hover"
                >
                  <span>TRY THIS QUESTION IN LIVE EDITOR</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right: Code & Execution Output (7 cols) */}
            <div className="border border-forge-border bg-forge-card lg:col-span-7">
              {/* File Bar */}
              <div className="flex items-center justify-between border-b border-forge-border bg-forge-card-alt px-4 py-2 font-['JetBrains_Mono'] text-xs">
                <span className="text-forge-text">{currentDrill.file}</span>
                <span className="text-forge-success">{currentDrill.dialect}</span>
              </div>

              {/* SQL Snippet (Dark Code Terminal) */}
              <div className="overflow-x-auto bg-[#101114] p-4 font-['JetBrains_Mono'] text-xs leading-6 text-[#F4F1EA]">
                <pre className="whitespace-pre-wrap">{currentDrill.sql}</pre>
              </div>

              {/* Output Header */}
              <div className="flex items-center justify-between border-y border-forge-border bg-forge-card-alt px-4 py-2 font-['JetBrains_Mono'] text-xs">
                <span className="text-forge-success">
                  ✓ QUERY COMPLETED IN {currentDrill.stats.executionTime}
                </span>
                <span className="text-forge-muted">SPEED: {currentDrill.stats.costScore}</span>
              </div>

              {/* Output Rows */}
              <div className="overflow-x-auto bg-forge-card p-4 font-['JetBrains_Mono'] text-xs">
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
      {/* SECTION 03: 3-STEP LEARNING METHODOLOGY                                    */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
            <span>// 03 HOW IT WORKS</span>
            <span className="text-forge-border">|</span>
            <span className="text-forge-muted">3 SIMPLE STEPS</span>
          </div>
          <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-5xl">
            HOW YOU BUILD SQL CONFIDENCE.
          </h2>
          <p className="mt-4 max-w-xl font-['Inter'] text-sm leading-relaxed text-forge-muted">
            A simple, repeatable process to take you from learning syntax to solving tough
            interview questions on your own.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 01 */}
          <div className="relative border border-forge-border bg-forge-card p-8">
            <div className="font-['Space_Grotesk'] text-5xl font-extrabold text-forge-border">
              01
            </div>
            <div className="mt-4 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-forge-accent">
              STEP 1: UNDERSTAND
            </div>
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Read the Problem & Tables
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Review the question, see what columns are available in each table, and understand
              what the final answer should look like.
            </p>
            <div className="mt-6 border-t border-forge-border pt-3 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              GOAL: CLEAR PROBLEM UNDERSTANDING
            </div>
          </div>

          {/* Step 02 */}
          <div className="relative border border-forge-border bg-forge-card p-8">
            <div className="font-['Space_Grotesk'] text-5xl font-extrabold text-forge-border">
              02
            </div>
            <div className="mt-4 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-forge-accent">
              STEP 2: WRITE & RUN
            </div>
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Write and Test Your Query
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Write your query in our built-in editor with helpful syntax highlighting. Hit "Run" at
              any time to inspect intermediate results.
            </p>
            <div className="mt-6 border-t border-forge-border pt-3 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              GOAL: IMMEDIATE FEEDBACK
            </div>
          </div>

          {/* Step 03 */}
          <div className="relative border border-forge-border bg-forge-card p-8">
            <div className="font-['Space_Grotesk'] text-5xl font-extrabold text-forge-border">
              03
            </div>
            <div className="mt-4 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-forge-success">
              STEP 3: PASS TESTS
            </div>
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-forge-text">
              Verify Against Tricky Edge Cases
            </h3>
            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Your query is tested against hidden test datasets containing empty values, duplicates,
              and ties to make sure your solution is solid.
            </p>
            <div className="mt-6 border-t border-forge-border pt-3 font-['JetBrains_Mono'] text-[11px] text-forge-muted">
              GOAL: INTERVIEW READY
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: CLEAR COMPARISON TABLE                                         */}
      {/* ========================================================================= */}
      <section id="platform" className="relative z-10 border-t border-forge-border bg-forge-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
              <span>// 04 COMPARISON</span>
              <span className="text-forge-border">|</span>
              <span className="text-forge-muted">WHY CHOOSE SQLFORGE</span>
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-forge-text sm:text-5xl">
              WHY PRACTICE WITH US?
            </h2>
            <p className="mt-4 font-['Inter'] text-sm leading-relaxed text-forge-muted">
              Here is how SQLForge compares to regular coding websites and passive video tutorials.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto border border-forge-border bg-forge-card">
            <table className="w-full text-left font-['JetBrains_Mono'] text-xs">
              <thead>
                <tr className="border-b border-forge-border bg-forge-card-alt text-[11px] uppercase tracking-wider text-forge-muted">
                  <th className="p-4">WHAT YOU GET</th>
                  <th className="border-l border-forge-border p-4 text-forge-accent font-bold">
                    SQLFORGE
                  </th>
                  <th className="border-l border-forge-border p-4">GENERIC CODING SITES</th>
                  <th className="border-l border-forge-border p-4">VIDEO COURSES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-border text-forge-text">
                <tr>
                  <td className="p-4 font-semibold">Real Database Engine</td>
                  <td className="border-l border-forge-border p-4 text-forge-success font-bold">
                    ✓ Yes, runs real SQL
                  </td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Often simulated</td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">None (just watching)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Query Speed & Index Tips</td>
                  <td className="border-l border-forge-border p-4 text-forge-success font-bold">
                    ✓ Tells you if query is fast
                  </td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Only pass / fail</td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Theory only</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Multiple Database Flavors</td>
                  <td className="border-l border-forge-border p-4 text-forge-success font-bold">
                    ✓ PostgreSQL & MySQL
                  </td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Usually only one</td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Depends on video</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Tested on Tricky Edge Cases</td>
                  <td className="border-l border-forge-border p-4 text-forge-success font-bold">
                    ✓ Tests NULLs, ties & duplicates
                  </td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Only checks sample rows</td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">No hands-on tests</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Real Tech Interview Questions</td>
                  <td className="border-l border-forge-border p-4 text-forge-success font-bold">
                    ✓ From real tech companies
                  </td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">Random user questions</td>
                  <td className="border-l border-forge-border p-4 text-forge-muted">General concepts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05: TERMINAL CTA / GET STARTED                                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="relative border border-forge-border bg-forge-card p-8 sm:p-14 shadow-lg">
          {/* Engineering grid accent inside card */}
          <div className="pointer-events-none absolute inset-0 industrial-grid opacity-20" />

          {/* Corner Notch Markers */}
          <span className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-forge-accent" />
          <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-forge-accent" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-forge-border bg-forge-card-alt px-3 py-1 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-widest text-forge-accent">
              <span>READY TO PRACTICE?</span>
            </div>

            <h2 className="mt-6 font-['Space_Grotesk'] text-4xl font-extrabold tracking-tight text-forge-text sm:text-6xl">
              START PRACTICING SQL IN SECONDS.
            </h2>

            <p className="mt-4 font-['Inter'] text-base leading-relaxed text-forge-muted">
              Pick a challenge, write your query, and see results right in your browser. No
              downloads or credit card required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-3 border border-forge-accent bg-forge-accent px-8 py-4 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
              >
                <span>CREATE FREE ACCOUNT</span>
                <span className="text-base transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-forge-border bg-forge-surface px-7 py-4 font-['JetBrains_Mono'] text-sm font-semibold uppercase tracking-wider text-forge-text transition-colors hover:border-forge-muted hover:bg-forge-card-alt"
              >
                <span>LOG IN TO PRACTICE</span>
              </Link>
            </div>

            <div className="mt-8 font-['JetBrains_Mono'] text-xs text-forge-muted">
              FREE TO USE // IMMEDIATE ACCESS // NO INSTALLATION REQUIRED
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
