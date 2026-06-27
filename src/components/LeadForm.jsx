import { useState } from 'react'

const SOURCES = ['Website','LinkedIn','Referral','Cold Call','Event','Social Media','WhatsApp','Other']
const STATUSES = ['New','Contacted','Follow Up','Proposal Sent','Closed Won','Closed Lost']
const PRIORITIES = ['High','Medium','Low']

const empty = {
  fullName: '', phone: '', email: '', businessName: '',
  source: '', status: 'New', priority: 'Medium',
  nextFollowUpDate: '', notes: '',
}

export default function LeadForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'שם מלא הוא שדה חובה.'
    if (!form.phone.trim())    e.phone    = 'טלפון הוא שדה חובה.'
    if (!form.email.trim())    e.email    = 'אימייל הוא שדה חובה.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'כתובת אימייל לא תקינה.'
    if (!form.source)          e.source   = 'בחר מקור ליד.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Contact */}
      <div className="form-section-title">פרטי קשר</div>
      <div className="form-grid form-grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">שם מלא *</label>
          <input id="fullName" className="form-control" placeholder="ישראל ישראלי" value={form.fullName} onChange={set('fullName')} />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">טלפון *</label>
          <input id="phone" className="form-control" type="tel" placeholder="050-0000000" value={form.phone} onChange={set('phone')} />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">אימייל *</label>
          <input id="email" className="form-control" type="email" placeholder="name@company.co.il" value={form.email} onChange={set('email')} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="businessName">שם עסק</label>
          <input id="businessName" className="form-control" placeholder="שם החברה / עסק" value={form.businessName} onChange={set('businessName')} />
        </div>
      </div>

      {/* Lead details */}
      <div className="form-section-title">פרטי ליד</div>
      <div className="form-grid form-grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="source">מקור *</label>
          <select id="source" className="form-control" value={form.source} onChange={set('source')}>
            <option value="">בחר מקור…</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.source && <span className="form-error">{errors.source}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="status">סטטוס</label>
          <select id="status" className="form-control" value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="priority">עדיפות</label>
          <select id="priority" className="form-control" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="nextFollowUpDate">תאריך מעקב הבא</label>
          <input id="nextFollowUpDate" className="form-control" type="date" value={form.nextFollowUpDate} onChange={set('nextFollowUpDate')} min={new Date().toISOString().split('T')[0]} />
        </div>
      </div>

      {/* Notes */}
      <div className="form-section-title">הערה ראשונה</div>
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="notes">הערה</label>
        <textarea id="notes" className="form-control" placeholder="הוסף הקשר על הליד — איך הכרתם, מה הצרכים, כל מידע שיעזור…" value={form.notes} onChange={set('notes')} rows={3} />
        <span className="form-hint">אופציונלי. ניתן להוסיף הערות נוספות מעמוד פרטי הליד.</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'שומר…' : 'הוסף ליד'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setForm(empty)}>
          נקה
        </button>
      </div>
    </form>
  )
}
