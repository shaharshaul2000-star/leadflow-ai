import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import ActivityTimeline from '../components/ActivityTimeline'
import { getLeadById, updateLead, addNote, deleteLead, getTemplates } from '../services/leadService'
import { getAISuggestion } from '../utils/ai'
import { openWhatsApp, applyTemplate, buildWhatsAppUrl } from '../utils/whatsapp'

const STATUSES   = ['New','Contacted','Follow Up','Proposal Sent','Closed Won','Closed Lost']
const PRIORITIES = ['High','Medium','Low']

const avatarColors = ['#2563EB','#8B5CF6','#EC4899','#F59E0B','#10B981','#EF4444','#06B6D4','#84CC16']
function getColor(name) {
  let h = 0; for (let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h)
  return avatarColors[Math.abs(h)%avatarColors.length]
}
function getInitials(n) { return n.split(' ').map((w)=>w[0]).slice(0,2).join('').toUpperCase() }
function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('he-IL',{weekday:'short',year:'numeric',month:'short',day:'numeric'})
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {msg}
      </div>
    </div>
  )
}

export default function LeadDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [lead, setLead]           = useState(null)
  const [templates, setTemplates] = useState([])
  const [aiSuggestion, setAI]     = useState('')
  const [aiLoading, setAILoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    const found = getLeadById(id)
    if (!found) { navigate('/dashboard'); return }
    setLead(found)
    setTemplates(getTemplates())
  }, [id, navigate])

  const showToast = (msg, type = 'success') => setToast({ msg, type })
  const hideToast = useCallback(() => setToast(null), [])

  const handleField = (field) => (e) => {
    const val = e.target.value
    const updated = updateLead(id, { [field]: val })
    if (updated) {
      setLead(updated)
      showToast(`עודכן: ${field === 'status' ? val : field === 'priority' ? val : 'תאריך מעקב'}`)
    }
  }

  const handleAddNote = async (note) => {
    const updated = addNote(id, note)
    if (updated) {
      setLead(updated)
      showToast('הערה נוספה!')
    }
  }

  const handleDelete = () => {
    deleteLead(id)
    navigate('/dashboard')
  }

  const handleAI = async () => {
    setAILoading(true)
    setAI('')
    await new Promise((r) => setTimeout(r, 1200))
    setAI(getAISuggestion(lead))
    setAILoading(false)
  }

  const handleCopy = async () => {
    const text = [
      `👤 שם: ${lead.fullName}`,
      `🏢 עסק: ${lead.businessName || '—'}`,
      `📞 טלפון: ${lead.phone}`,
      `📧 אימייל: ${lead.email}`,
      `📊 סטטוס: ${lead.status}`,
      `⭐ עדיפות: ${lead.priority}`,
      `📅 מעקב: ${lead.nextFollowUpDate || '—'}`,
      `🔗 מקור: ${lead.source}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('פרטי הליד הועתקו ✓')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      showToast('ההעתקה נכשלה', 'error')
    }
  }

  if (!lead) return null

  const color = getColor(lead.fullName)

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container lead-details-page">

          <Link to="/dashboard" className="details-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            חזרה ל-Dashboard
          </Link>

          <div className="details-grid">
            {/* ── LEFT COLUMN ──────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

              {/* Lead info card */}
              <div className="details-card">
                <div className="details-card-header">
                  <div className="details-avatar-row">
                    <div className="details-avatar" style={{ background: color }}>
                      {getInitials(lead.fullName)}
                    </div>
                    <div>
                      <div className="details-name">{lead.fullName}</div>
                      {lead.businessName && <div className="details-biz">🏢 {lead.businessName}</div>}
                      <div className="details-badges">
                        <StatusBadge status={lead.status} />
                        <PriorityBadge priority={lead.priority} />
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="details-action-row">
                    <button
                      className="btn btn-whatsapp btn-sm"
                      onClick={() => openWhatsApp(lead.phone)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                      {copied ? '✓ הועתק' : '📋 העתק פרטים'}
                    </button>
                  </div>
                </div>

                <div className="details-card-body">
                  {/* Meta */}
                  <div className="details-meta-grid">
                    <div className="details-meta-item">
                      <div className="details-meta-label">אימייל</div>
                      <div className="details-meta-value"><a href={`mailto:${lead.email}`}>{lead.email}</a></div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">טלפון</div>
                      <div className="details-meta-value"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">מקור</div>
                      <div className="details-meta-value">{lead.source}</div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">נוצר</div>
                      <div className="details-meta-value">{fmtDate(lead.createdAt)}</div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">עדכון אחרון</div>
                      <div className="details-meta-value">{fmtDate(lead.updatedAt)}</div>
                    </div>
                    <div className="details-meta-item">
                      <div className="details-meta-label">מעקב הבא</div>
                      <div className="details-meta-value" style={{ color: lead.nextFollowUpDate && new Date(lead.nextFollowUpDate) < new Date() ? 'var(--danger)' : undefined }}>
                        {lead.nextFollowUpDate ? fmtDate(lead.nextFollowUpDate) : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="section-divider" />

                  {/* Inline edits */}
                  <div className="section-sub-title">עדכון מהיר</div>
                  <div className="form-grid form-grid-3" style={{ gap:'0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">סטטוס</label>
                      <select className="form-control" value={lead.status} onChange={handleField('status')}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">עדיפות</label>
                      <select className="form-control" value={lead.priority} onChange={handleField('priority')}>
                        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">מעקב הבא</label>
                      <input
                        type="date" className="form-control"
                        value={lead.nextFollowUpDate || ''}
                        onChange={handleField('nextFollowUpDate')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="details-card">
                <div className="details-card-header">
                  <div style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--text)' }}>
                    פעילות והערות
                    <span style={{ marginLeft:'0.4rem', fontWeight:400, color:'var(--text-muted)', fontSize:'0.8rem' }}>
                      ({lead.notes?.length || 0})
                    </span>
                  </div>
                </div>
                <div className="details-card-body">
                  <ActivityTimeline notes={lead.notes} onAdd={handleAddNote} />
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

              {/* AI Suggestion */}
              <div className="ai-card">
                <div className="ai-card-header">
                  <span className="ai-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    AI
                  </span>
                  <span className="ai-title">המלצת צעד הבא</span>
                </div>
                <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.75rem', lineHeight:1.55 }}>
                  המלצה מותאמת לסטטוס ועדיפות הליד.
                </p>
                <div className={`ai-loading${aiLoading ? ' visible' : ''}`}>
                  <div className="ai-spinner" />מנתח את הליד…
                </div>
                <div className={`ai-suggestion-text${aiSuggestion && !aiLoading ? ' visible' : ''}`}>
                  {aiSuggestion}
                </div>
                {!aiLoading && (
                  <button className="btn btn-primary btn-sm btn-full" onClick={handleAI} style={{ marginTop: aiSuggestion ? '0.75rem' : 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    {aiSuggestion ? 'המלצה חדשה' : 'קבל המלצת AI'}
                  </button>
                )}
              </div>

              {/* WhatsApp Templates */}
              <div className="wa-templates-card">
                <div className="wa-templates-header">
                  <div className="wa-templates-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    תבניות WhatsApp
                  </div>
                </div>
                {templates.map((tpl) => {
                  const msg = applyTemplate(tpl, lead)
                  return (
                    <div key={tpl.id} className="wa-template-item">
                      <div className="wa-template-name">{tpl.name}</div>
                      <div className="wa-template-preview">{msg}</div>
                      <a
                        href={buildWhatsAppUrl(lead.phone, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-btn"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        פתח WhatsApp
                      </a>
                    </div>
                  )
                })}
              </div>

              {/* Quick summary */}
              <div className="details-card">
                <div className="details-card-body">
                  <div className="section-sub-title" style={{ marginBottom:'0.75rem' }}>סיכום מהיר</div>
                  {[
                    { label: 'Lead ID', value: `#${lead.id}` },
                    { label: 'מקור', value: lead.source },
                    { label: 'הערות', value: `${lead.notes?.length || 0}` },
                    { label: 'סטטוס', value: lead.status },
                    { label: 'עדיפות', value: lead.priority },
                  ].map((row) => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:'0.5rem' }}>
                      <span style={{ color:'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ fontWeight:600, color:'var(--text)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p>מחיקת ליד היא פעולה בלתי הפיכה.</p>
                <button className="btn btn-danger btn-sm btn-full" onClick={() => setShowDelete(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                  מחק ליד
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Modal */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <div className="modal-title">למחוק את הליד?</div>
            <div className="modal-desc">
              אתה עומד למחוק את <strong>{lead.fullName}</strong> לצמיתות. לא ניתן לבטל פעולה זו.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>ביטול</button>
              <button className="btn btn-danger" onClick={handleDelete}>כן, מחק</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
