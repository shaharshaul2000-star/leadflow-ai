import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LeadForm from '../components/LeadForm'
import { saveLead } from '../utils/storage'

export default function AddLead() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    saveLead(formData)
    setLoading(false)
    setSaved(true)
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container add-lead-page">

          <div className="page-header">
            <Link to="/dashboard" className="details-back" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Dashboard
            </Link>
            <div className="page-header-title">Add New Lead</div>
            <div className="page-header-sub">Fill in the details below to add a new contact to your pipeline.</div>
          </div>

          {saved && (
            <div style={{
              background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              color: '#15803D', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.9rem',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Lead saved successfully! Redirecting to dashboard…
            </div>
          )}

          <div className="add-lead-layout">
            <div className="add-lead-form-card">
              <LeadForm onSubmit={handleSubmit} loading={loading} />
            </div>

            <div className="add-lead-sidebar">
              <div className="tip-card">
                <h4>
                  <span>💡</span> Tips for better leads
                </h4>
                <div className="tip-list">
                  <div className="tip-item">Add a note from your first conversation to give AI better context.</div>
                  <div className="tip-item">Choose the right source so you can track which channels work best.</div>
                  <div className="tip-item">Use the phone field — quick calls often outperform email follow-ups.</div>
                  <div className="tip-item">Set the correct initial status to keep your pipeline accurate.</div>
                </div>
              </div>

              <div className="tip-card">
                <h4>
                  <span>🏷️</span> Status Guide
                </h4>
                <div className="tip-list">
                  <div className="tip-item"><strong>New</strong> — Just added, not yet contacted.</div>
                  <div className="tip-item"><strong>Contacted</strong> — First outreach made.</div>
                  <div className="tip-item"><strong>In Progress</strong> — Active negotiation.</div>
                  <div className="tip-item"><strong>Closed</strong> — Deal won!</div>
                  <div className="tip-item"><strong>Lost</strong> — Went elsewhere for now.</div>
                </div>
              </div>

              <div className="tip-card" style={{ background: 'var(--primary-light)', borderColor: 'rgba(37,99,235,0.2)' }}>
                <h4 style={{ color: 'var(--primary)' }}>
                  <span>🤖</span> AI Ready
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Once you add a lead, visit their profile to get an AI-powered next-step recommendation based on their status and notes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
