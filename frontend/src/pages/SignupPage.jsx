import { useState } from 'react'
import { Link } from 'react-router-dom'

function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 bg-forge-bg text-forge-text transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 industrial-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md border border-forge-border bg-forge-card p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-forge-border pb-3 font-['JetBrains_Mono'] text-xs text-forge-muted">
          <span>REGISTRATION</span>
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-forge-text">
            CREATE YOUR FREE ACCOUNT
          </h1>
          <p className="mt-1 font-['Inter'] text-xs text-forge-muted">
            Start practicing SQL interview questions right away. No setup required.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full border border-forge-accent bg-forge-accent py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-colors hover:bg-forge-accent-hover"
          >
            CREATE FREE ACCOUNT ↗
          </button>
        </form>

        <div className="mt-6 border-t border-forge-border pt-4 text-center font-['JetBrains_Mono'] text-xs text-forge-muted">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-forge-accent hover:underline">
            LOG IN HERE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
