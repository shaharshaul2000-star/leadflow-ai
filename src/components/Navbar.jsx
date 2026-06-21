import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const BrandIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14 L6 7 L9.5 11.5 L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="15.5" cy="5" r="2" fill="#22C55E"/>
  </svg>
)

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/add-lead', label: 'Add Lead' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-icon"><BrandIcon /></span>
          LeadFlow <span className="brand-ai">AI</span>
        </Link>

        <div className="navbar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${isActive(link.to) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link
            to="/login"
            className="btn btn-secondary btn-sm"
            style={{ display: location.pathname === '/login' ? 'none' : undefined }}
          >
            Sign In
          </Link>
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link${isActive(link.to) ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/login"
          className="nav-link"
          onClick={() => setMobileOpen(false)}
        >
          Sign In
        </Link>
      </div>
    </nav>
  )
}
