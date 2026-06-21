import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email.'
    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    localStorage.setItem('lf_user', JSON.stringify({ email: form.email, name: form.name }))
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

        <h1 className="auth-title" style={{ marginTop: '1.25rem' }}>Create your account</h1>
        <p className="auth-subtitle">Start managing your leads smarter, for free.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-control"
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

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
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
            {!errors.password && form.password.length > 0 && (
              <span className="form-hint">
                Strength: {form.password.length < 10 ? '🟡 Fair' : form.password.length < 14 ? '🟢 Good' : '💪 Strong'}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
