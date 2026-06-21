import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatusBadge from '../components/StatusBadge'
import { getLeadById, updateLeadStatus, addNote, deleteLead } from '../utils/storage'
import { getAISuggestion } from '../utils/ai'

const STATUSES = ['New', 'Contacted', 'In Progress', 'Closed', 'Lost']

const avatarColors = [
  '#2563EB','#8B5CF6','#EC4899','#F59E0B',
  '#10B981','#EF4444','#06B6D4','#84CC16',
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const found = getLeadById(id)
    if (!found) { navigate('/dashboard'); return }
    setLead(found)
  }, [id, navigate])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    const updated = updateLeadStatus(id, newStatus)
    if (updated) {
      setLead(updated)
      setAiSuggestion('')
      showToast(`Status updated to "${newStatus}"`)
    }
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const updated = addNote(id, noteText.trim())
    if (updated) {
      setLead(updated)
      setNoteText('')
      showToast('Note added!')
    }
  }

  const handleAiSuggestion = async () => {
    setAiLoading(true)
    setAiSuggestion('')
    await new Promise((r) => setTimeout(r, 1400))
    setAiSuggestion(getAISuggestion(lead))
    setAiLoading(false)
  }

  const handleDelete = () => {
    deleteLead(id)
    navigate('/dashboard')
  }

  if (!lead) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="page-main">
          <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading…
          </div>
        </main>
      </div>
    )
  }

  const color = getColor(lead.fullName)

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container lead-details-page">

          <Link to="/dashboard" className="details-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </Link>

          <div className="details-grid">
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Lead info card */}
              <div className="details-card">
                <div className="details-card-header">
                  <div className="details-avatar-row">
                    <div className="details-avatar" style={{ background: color }}>
                      {getInitials(lead.fullName)}
                    </div>
                    <div>
                      <div className="details-name">{lead.fullName}</div>
                      <div className="details-source">Source: {lead.source}</div>
                    </div>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>

                <div className="details-card-body">
                  <div className="details-meta-grid">
                    <div className="details-meta-item">
                      <div className="details-meta-label">Email</div>
                      <div className="details-meta-value">
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      </div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">Phone</div>
                      <div className="details-meta-value">
                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">Added</div>
                      <div className="details-meta-value">{formatDate(lead.createdAt)}</div>
                    </div>
                  </div>

                  <div className="section-divider" />

                  {/* Status update */}
                  <div style={{ marginBottom: '0' }}>
                    <div className="details-meta-label" style={{ marginBottom: '0.6rem' }}>Update Status</div>
                    <div className="status-select-wrapper">
                      <select
                        className="form-control"
                        value={lead.status}
                        onChange={handleStatusChange}
                        style={{ maxWidth: 200 }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <StatusBadge status={lead.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes card */}
              <div className="details-card">
                <div className="details-card-header" style={{ paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                      Notes
                      <span style={{ marginLeft: '0.5rem', fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        ({lead.notes?.length || 0})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="details-card-body">
                  {(!lead.notes || lead.notes.length === 0) ? (
                    <div className="note-empty">No notes yet. Add one below.</div>
                  ) : (
                    <div className="notes-list">
                      {lead.notes.map((note, i) => (
                        <div key={i} className="note-item">
                          <div className="note-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                          </div>
                          <div className="note-text">{note}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="add-note-form">
                    <textarea
                      placeholder="Add a new note…"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleAddNote() }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      style={{ alignSelf: 'flex-end', flexShrink: 0 }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                    Tip: press ⌘ + Enter to add
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* AI Suggestion */}
              <div className="ai-card">
                <div className="ai-card-header">
                  <span className="ai-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    AI
                  </span>
                  <span className="ai-title">Smart Suggestion</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.55 }}>
                  Get a personalized next-step recommendation based on this lead's status and history.
                </p>

                <div className={`ai-loading${aiLoading ? ' visible' : ''}`}>
                  <div className="ai-spinner" />
                  Analyzing lead data…
                </div>

                <div className={`ai-suggestion-text${aiSuggestion && !aiLoading ? ' visible' : ''}`}>
                  "{aiSuggestion}"
                </div>

                {!aiLoading && (
                  <button
                    className="btn btn-primary btn-sm btn-full"
                    onClick={handleAiSuggestion}
                    style={{ marginTop: aiSuggestion ? '0.85rem' : 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    {aiSuggestion ? 'Get New Suggestion' : 'Get AI Suggestion'}
                  </button>
                )}
              </div>

              {/* Quick stats */}
              <div className="details-card">
                <div className="details-card-body">
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.85rem' }}>
                    Quick Summary
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { label: 'Lead ID', value: `#${lead.id}` },
                      { label: 'Source', value: lead.source },
                      { label: 'Notes count', value: lead.notes?.length || 0 },
                      { label: 'Current status', value: lead.status },
                    ].map((row) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p>Deleting this lead is permanent and cannot be undone.</p>
                <button
                  className="btn btn-danger btn-sm btn-full"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                  Delete Lead
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <div className="modal-title">Delete this lead?</div>
            <div className="modal-desc">
              You're about to permanently delete <strong>{lead.fullName}</strong>.
              This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
