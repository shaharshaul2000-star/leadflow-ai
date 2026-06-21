import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email.'
    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem('lf_user', JSON.stringify({ email: form.email, name: 'Demo User' }))
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path d="M2 14 L6 7 L9.5 11.5 L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15.5" cy="5" r="2" fill="#22C55E"/>
            </svg>
          </div>
          <span className="auth-logo-text">LeadFlow <span>AI</span></span>
        </div>

        <h1 className="auth-title" style={{ marginTop: '1.25rem' }}>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
              <span style={{ float: 'right', fontWeight: 400, color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or continue as demo</span></div>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => {
            localStorage.setItem('lf_user', JSON.stringify({ email: 'demo@leadflow.ai', name: 'Demo User' }))
            navigate('/dashboard')
          }}
        >
          Continue as Demo User
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
