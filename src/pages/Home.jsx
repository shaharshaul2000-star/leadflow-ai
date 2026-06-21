import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const features = [
  {
    icon: '📊',
    bg: '#EFF6FF',
    title: 'Smart Dashboard',
    desc: 'See all your leads at a glance with real-time stats on total leads, pipeline stage, and closed deals.',
  },
  {
    icon: '🤖',
    bg: '#F5F3FF',
    title: 'AI Suggestions',
    desc: 'Get personalized next-step recommendations for each lead so you always know the right move.',
  },
  {
    icon: '📝',
    bg: '#F0FDF4',
    title: 'Note Tracking',
    desc: 'Log every interaction with timestamped notes so you never lose context on a conversation.',
  },
  {
    icon: '🏷️',
    bg: '#FFFBEB',
    title: 'Status Pipeline',
    desc: 'Move leads through New → Contacted → In Progress → Closed with a single click.',
  },
  {
    icon: '🔍',
    bg: '#FFF1F2',
    title: 'Search & Filter',
    desc: 'Instantly find any lead by name, email, or status across your entire contact database.',
  },
  {
    icon: '📱',
    bg: '#F0FDFA',
    title: 'Works Anywhere',
    desc: 'Fully responsive — manage your leads from desktop, tablet, or phone with the same great experience.',
  },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Nav bar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>
            <div style={{
              width: 32, height: 32, background: '#2563EB', borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M2 14 L6 7 L9.5 11.5 L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="15.5" cy="5" r="2" fill="#22C55E"/>
              </svg>
            </div>
            LeadFlow <span style={{ color: '#60A5FA' }}>AI</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login" style={{
              color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500,
              padding: '0.45rem 0.85rem', borderRadius: 6, transition: 'color 0.18s',
            }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              background: '#2563EB', color: '#fff', fontSize: '0.875rem', fontWeight: 700,
              padding: '0.5rem 1.1rem', borderRadius: 8, transition: 'all 0.18s',
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero" style={{ paddingTop: '8rem' }}>
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Powered by AI · Free for small teams
        </div>
        <h1 className="hero-title">
          Close More Deals with<br />
          <span className="gradient-text">Smarter Lead Management</span>
        </h1>
        <p className="hero-subtitle">
          LeadFlow AI is the CRM built for small businesses — track leads, log notes,
          update pipelines, and let AI tell you exactly what to do next.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn-hero-primary">
            Open Dashboard →
          </Link>
          <Link to="/register" className="btn-hero-ghost">
            Create Free Account
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <div className="hero-stat-value">2x</div>
            <div className="hero-stat-label">Faster follow-ups</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Free to start</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-value">AI</div>
            <div className="hero-stat-label">Suggestions built-in</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="section-header">
          <span className="section-eyebrow">Everything you need</span>
          <h2 className="section-title">CRM that actually works for you</h2>
          <p className="section-desc">No bloated features, no complexity. Just the tools you need to grow your business.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to grow your pipeline?</h2>
        <p>Join hundreds of small businesses using LeadFlow AI to close more deals.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{
            background: '#fff', color: '#2563EB', fontWeight: 700, fontSize: '1rem',
            padding: '0.85rem 2rem', borderRadius: 12, transition: 'all 0.18s',
            display: 'inline-block',
          }}>
            Go to Dashboard
          </Link>
          <Link to="/register" style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '1rem',
            padding: '0.85rem 2rem', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.3)',
            transition: 'all 0.18s', display: 'inline-block',
          }}>
            Create Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
