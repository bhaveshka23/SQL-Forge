import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-forge-border bg-forge-bg text-forge-muted transition-colors duration-200">
      

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-forge-border bg-forge-surface">
                <svg
                  className="h-4 w-4 text-forge-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6c0-1.5 3.5-2.5 8-2.5s8 1 8 2.5-3.5 2.5-8 2.5-8-1-8-2.5z" />
                  <path d="M4 6v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5V6" />
                  <path d="M4 12v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" />
                </svg>
              </div>
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-wider text-forge-text">
                SQL<span className="text-forge-accent">FORGE</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm font-['Inter'] text-sm leading-relaxed text-forge-muted">
              The interactive SQL practice platform built to help software engineers and data
              analysts master queries and pass technical interviews.
            </p>

            <div className="mt-6 flex items-center gap-3 font-['JetBrains_Mono'] text-xs text-forge-muted">
              <span className="border border-forge-border bg-forge-surface px-2.5 py-1">
                TAGLINE: BUILD. EXECUTE. MASTER.
              </span>
            </div>
          </div>

          {/* Drill Sets */}
          <div>
            <h4 className="font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-forge-text">
              01 PRACTICE DRILLS
            </h4>
            <ul className="mt-4 space-y-2.5 font-['Inter'] text-sm">
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Window Functions & Ranks
                </a>
              </li>
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Recursive CTEs & Hierarchies
                </a>
              </li>
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Query Optimization & Speed
                </a>
              </li>
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Tech Interview Tracks
                </a>
              </li>
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Real Business Scenarios
                </a>
              </li>
            </ul>
          </div>

          

          {/* System & Architecture */}
          <div>
            <h4 className="font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-forge-text">
              02 PLATFORM
            </h4>
            <ul className="mt-4 space-y-2.5 font-['Inter'] text-sm">
              <li>
                <a href="#features" className="transition-colors hover:text-forge-accent">
                  Features Overview
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-forge-accent">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/signup" className="transition-colors hover:text-forge-accent">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-forge-accent">
                  Log In
                </Link>
              </li>
              <li>
                <span className="font-['JetBrains_Mono'] text-xs text-forge-muted/70">
                  STATUS: 100% OPERATIONAL
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-forge-border pt-8 font-['JetBrains_Mono'] text-xs sm:flex-row">
          <div className="text-forge-muted">
            © {new Date().getFullYear()} SQLFORGE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 text-forge-muted">
            <span>PRIVACY POLICY</span>
            <span>//</span>
            <span>TERMS OF SERVICE</span>
            <span>//</span>
            <span>SYSTEM STATUS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
