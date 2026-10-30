import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'PLATFORM', href: '#platform', id: 'platform' },
    { label: 'FEATURES', href: '#features', id: 'features' },
    { label: 'PRACTICE', href: '#practice', id: 'practice' },
    { label: 'HOW IT WORKS', href: '#how-it-works', id: 'how-it-works' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? 'bg-forge-bg/95 backdrop-blur-sm border-b border-forge-border'
          : 'bg-forge-bg border-b border-forge-border'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity with Anvil/Forge Icon */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-surface transition-colors group-hover:border-forge-accent">
            {/* Geometric Anvil / Database Forge Icon */}
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

          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-lg font-bold tracking-wider text-forge-text transition-colors group-hover:text-forge-accent">
              SQL<span className="text-forge-accent">FORGE</span>
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-forge-muted">
              SQL PRACTICE // 2026
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative flex items-center gap-1.5 py-1 font-['JetBrains_Mono'] text-xs font-medium uppercase tracking-wider text-forge-muted transition-colors hover:text-forge-text"
            >
              <span className="text-[10px] text-forge-muted/60 transition-colors group-hover:text-forge-accent">
                0{idx + 1}.
              </span>
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-forge-accent transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Auth Action Buttons & Theme Toggle */}
        <div className="hidden items-center gap-3 sm:gap-4 md:flex">
          {/* Industrial Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 border border-forge-border bg-forge-surface px-2.5 py-1.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted transition-colors hover:border-forge-accent hover:text-forge-text"
            aria-label="Toggle dark/light mode"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <>
                <svg className="h-3.5 w-3.5 text-forge-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="square" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span className="text-[10px] font-semibold">LIGHT</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-forge-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="square" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="text-[10px] font-semibold">DARK</span>
              </>
            )}
          </button>

          <Link
            to="/login"
            className="px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-forge-muted transition-colors hover:text-forge-text"
          >
            LOGIN
          </Link>

          <Link
            to="/signup"
            className="group relative inline-flex items-center gap-2 border border-forge-accent bg-forge-accent px-4 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover"
          >
            <span>SIGN UP</span>
            <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 bg-forge-bg" />
          </Link>
        </div>

        {/* Mobile controls: Theme toggle + hamburger toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-surface text-forge-accent"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="square" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="square" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center border border-forge-border bg-forge-surface text-forge-muted hover:text-forge-text"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-forge-border bg-forge-surface px-4 py-6 md:hidden">
          <div className="mb-4 border-b border-forge-border pb-2 font-['JetBrains_Mono'] text-[10px] text-forge-muted">
            NAVIGATION // SELECTION
          </div>
          <div className="flex flex-col gap-4">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-['JetBrains_Mono'] text-sm uppercase tracking-wider text-forge-muted hover:text-forge-accent"
              >
                <span>{link.label}</span>
                <span className="text-xs text-forge-muted/50">0{idx + 1}</span>
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-forge-border">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center border border-forge-border py-2.5 font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-forge-text"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center bg-forge-accent py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114]"
              >
                SIGN UP ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
