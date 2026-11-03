import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  // Navigation items grouped by category
  const navSections = [
    {
      category: '',
      items: [
        {
          label: 'Overview',
          path: '/dashboard',
          exact: true,
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          label: 'Practice Drills',
          path: '/dashboard/drills',
          
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          label: 'SQL Editor',
          path: '/dashboard/editor',
          
          badgeColor: 'text-forge-success',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      category: '',
      items: [
        {
          label: 'Interview Crucible',
          path: '/dashboard/interview',
          
          badgeColor: 'text-forge-accent',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        },
        {
          label: 'Query Optimization',
          path: '/dashboard/optimization',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      category: '',
      items: [
        {
          label: 'Submission History',
          path: '/dashboard/submissions',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: 'Skill Matrix',
          path: '/dashboard/analytics',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
      ],
    },
  ]

  // Compute readable breadcrumb title from path
  const currentPath = location.pathname
  const getBreadcrumbTitle = () => {
    if (currentPath === '/dashboard') return 'OVERVIEW'
    const parts = currentPath.split('/')
    const last = parts[parts.length - 1]
    return last.toUpperCase().replace('-', ' ')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-forge-bg text-forge-text transition-colors duration-200">
      {/* Background Engineering Grid Pattern */}
      <div className="pointer-events-none fixed inset-0 industrial-grid opacity-25 z-0" />

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR: Collapsible Industrial Sidebar                           */}
      {/* ========================================================================= */}
      <aside
        className={`relative z-30 hidden md:flex flex-col border-r border-forge-border bg-forge-surface transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-forge-border px-4">
          <Link to="/" className="group flex items-center gap-3 overflow-hidden">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-forge-border bg-forge-card transition-colors group-hover:border-forge-accent">
              {/* Forge / Database Icon */}
              <svg
                className="h-5 w-5 text-forge-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M4 6c0-1.5 3.5-2.5 8-2.5s8 1 8 2.5-3.5 2.5-8 2.5-8-1-8-2.5z" />
                <path d="M4 6v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5V6" />
                <path d="M4 12v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" />
                <path d="M12 9v6" stroke="#FF8354" strokeWidth="2.5" />
                <path d="M9 12h6" stroke="#FF8354" strokeWidth="2.5" />
              </svg>
              <span className="absolute -top-1 -right-1 h-1.5 w-1.5 bg-forge-accent" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-['Space_Grotesk'] text-base font-bold tracking-wider text-forge-text transition-colors group-hover:text-forge-accent">
                  SQL<span className="text-forge-accent">FORGE</span>
                </span>
                
              </div>
            )}
          </Link>

          {/* Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center border border-forge-border bg-forge-card text-forge-muted transition-colors hover:border-forge-accent hover:text-forge-text"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            <span className="font-['JetBrains_Mono'] text-xs font-bold">
              {isCollapsed ? '»' : '«'}
            </span>
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.category} className="space-y-1">
              

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all ${
                      isActive
                        ? 'border-l-2 border-forge-accent bg-forge-card text-forge-accent font-semibold shadow-xs'
                        : 'border-l-2 border-transparent text-forge-muted hover:bg-forge-card-alt hover:text-forge-text'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0 transition-transform duration-150 group-hover:scale-110">
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 border border-forge-border bg-forge-surface font-semibold ${
                            item.badgeColor || 'text-forge-muted'
                          }`}
                        >
                          
                        </span>
                      )}
                    </div>
                  )}

                  {/* Corner indicator when active */}
                  {isCollapsed && (
                    <span className="absolute bottom-1 right-1 h-1 w-1 bg-forge-accent opacity-0 group-[.active]:opacity-100" />
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar Telemetry & User Session Footer */}
        <div className="border-t border-forge-border bg-forge-card-alt p-3">
          {!isCollapsed ? (
            <div className="space-y-3 font-['JetBrains_Mono'] text-xs">

              {/* User Profile Mini Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-forge-accent bg-forge-surface text-xs font-bold text-forge-accent">
                    SQ
                  </div>
                  <div className="truncate text-left">
                    <div className="truncate text-xs font-semibold text-forge-text">
                      engineer_01
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="p-1.5 text-forge-muted transition-colors hover:text-forge-accent"
                  title="Sign out session"
                  aria-label="Sign out"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              
              <Link
                to="/login"
                className="p-1 text-forge-muted hover:text-forge-accent"
                title="Sign out"
                aria-label="Sign out"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER: Backdrop & Mobile Navigation                               */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative z-50 flex w-72 flex-col border-r border-forge-border bg-forge-surface p-4">
            <div className="flex items-center justify-between border-b border-forge-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center border border-forge-accent bg-forge-card text-forge-accent">
                  <span className="font-['Space_Grotesk'] text-sm font-bold">SQ</span>
                </div>
                <span className="font-['Space_Grotesk'] text-base font-bold text-forge-text">
                  SQL<span className="text-forge-accent">FORGE</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-forge-muted hover:text-forge-text"
                aria-label="Close drawer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {navSections.map((section) => (
                <div key={section.category} className="space-y-1">
                  
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wider ${
                          isActive
                            ? 'border-l-2 border-forge-accent bg-forge-card text-forge-accent font-semibold'
                            : 'border-l-2 border-transparent text-forge-muted hover:text-forge-text'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="border border-forge-border px-1.5 py-0.5 text-[9px] text-forge-muted">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>

            <div className="border-t border-forge-border pt-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-forge-border bg-forge-card py-2.5 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-forge-text"
              >
                <span>SIGN OUT SESSION</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: Header & Routed Outlet                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Header / Command Bar */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-forge-border bg-forge-surface/90 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-card text-forge-muted hover:text-forge-text md:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
              <span className="hidden text-forge-muted sm:inline">SYS</span>
              <span className="hidden text-forge-border sm:inline">/</span>
              <span className="text-forge-muted">DASHBOARD</span>
              <span className="text-forge-border">/</span>
              <span className="font-semibold text-forge-accent">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Right: Quick Actions, Dialect Badge, Theme Toggle & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            

            {/* Quick Action: New Query */}
            <Link
              to="/dashboard/editor"
              className="group relative inline-flex items-center gap-2 border border-forge-accent bg-forge-accent px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
            >
              <span>+ NEW QUERY</span>
              <span className="hidden sm:inline transition-transform duration-150 group-hover:translate-x-0.5">
                ↗
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 bg-forge-bg" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-card text-forge-muted transition-colors hover:border-forge-accent hover:text-forge-text"
              aria-label="Toggle light or dark theme"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <svg className="h-4 w-4 text-forge-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="square" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-forge-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="square" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* User Avatar */}
            <div className="flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-card font-['JetBrains_Mono'] text-xs font-bold text-forge-accent">
              SQ
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Surface */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

