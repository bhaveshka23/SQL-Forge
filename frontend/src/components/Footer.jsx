import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-forge-border bg-forge-bg text-forge-muted transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-forge-border bg-forge-surface">
                <svg
                  className="h-4 w-4 text-forge-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6c0-1.5 3.5-2.5 8-2.5s8 1 8 2.5-3.5 2.5-8 2.5-8-1-8-2.5z" />
                  <path d="M4 6v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5V6" />
                  <path d="M4 12v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" />
                </svg>
              </div>
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-forge-text">
                SQL<span className="text-forge-accent">FORGE</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-forge-muted">
              Interactive SQL practice platform designed to help developers and analysts master query writing and succeed in technical interviews.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-forge-muted">
              <span className="inline-block rounded-md border border-forge-border bg-forge-surface px-3 py-1 font-medium">
                Build. Execute. Master.
              </span>
            </div>
          </div>

          {/* Drill Sets */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forge-text">
              Practice Drills
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
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
                  Interview Question Tracks
                </a>
              </li>
              <li>
                <a href="#practice" className="transition-colors hover:text-forge-accent">
                  Real Business Scenarios
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forge-text">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
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
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-forge-border pt-8 text-xs text-forge-muted sm:flex-row">
          <div>
            © {new Date().getFullYear()} SQLForge. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-forge-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-forge-text transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-forge-text transition-colors">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
