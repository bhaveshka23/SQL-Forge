import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFromData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Registration successful!')
        navigate('/login')
      } else {
        const errorMessage = JSON.stringify(data).toLowerCase()

        if (
          errorMessage.includes('email') &&
          (errorMessage.includes('already') ||
            errorMessage.includes('exists') ||
            errorMessage.includes('unique'))
        ) {
          toast.error('Email already exists! Please use another email.')
        } else {
          toast.error(data.message || data.detail || 'Registration failed!')
        }
      }
    } catch {
      toast.error('Unable to connect to the server!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 bg-forge-bg text-forge-text transition-colors duration-200">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-forge-border bg-forge-card p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-forge-accent/40 bg-forge-accent/10 text-forge-accent">
            <svg
              className="h-5 w-5"
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
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-forge-text">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-forge-muted">
            Start practicing SQL interview questions right away. Free forever.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forge-muted">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="mt-1.5 w-full rounded-lg border border-forge-border bg-forge-card-alt px-3.5 py-2.5 text-sm text-forge-text placeholder-forge-muted/40 transition-colors focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forge-muted">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="mt-1.5 w-full rounded-lg border border-forge-border bg-forge-card-alt px-3.5 py-2.5 text-sm text-forge-text placeholder-forge-muted/40 transition-colors focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forge-muted">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-lg border border-forge-border bg-forge-card-alt px-3.5 py-2.5 text-sm text-forge-text placeholder-forge-muted/40 transition-colors focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forge-muted">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-lg border border-forge-border bg-forge-card-alt px-3.5 py-2.5 text-sm text-forge-text placeholder-forge-muted/40 transition-colors focus:border-forge-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg border border-forge-accent bg-forge-accent py-2.5 text-sm font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 border-t border-forge-border pt-4 text-center text-xs text-forge-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-forge-accent hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
