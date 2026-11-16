import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/', {
        username: formData.username,
        password: formData.password,
      })

      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)

      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Invalid username or password'
      toast.error(errorMessage)
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
            Log in to SQLForge
          </h1>
          <p className="mt-1.5 text-sm text-forge-muted">
            Continue your SQL practice drills and track your progress.
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
              placeholder="Enter your username"
              className="mt-1.5 w-full rounded-lg border border-forge-border bg-forge-card-alt px-3.5 py-2.5 text-sm text-forge-text placeholder-forge-muted/40 transition-colors focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium uppercase tracking-wider text-forge-muted">
                Password
              </label>
              <a href="#" className="text-xs text-forge-accent hover:underline">
                Forgot password?
              </a>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg border border-forge-accent bg-forge-accent py-2.5 text-sm font-semibold text-[#101114] transition-all hover:bg-forge-accent-hover hover:border-forge-accent-hover cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 border-t border-forge-border pt-4 text-center text-xs text-forge-muted">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-medium text-forge-accent hover:underline">
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
