import { useState } from 'react'

const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Event', 'Social Media', 'Email Campaign', 'Other']
const STATUSES = ['New', 'Contacted', 'In Progress', 'Closed', 'Lost']

const emptyForm = {
  fullName: '',
  phone: '',
  email: '',
  source: '',
  status: 'New',
  notes: '',
}

export default function LeadForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email.'
    if (!form.phone.trim()) errs.phone = 'Phone number is required.'
    if (!form.source) errs.source = 'Please select a source.'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-section-title">Contact Information</div>
      <div className="form-grid form-grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            className="form-control"
            type="text"
            placeholder="Jane Smith"
            value={form.fullName}
            onChange={set('fullName')}
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone *</label>
          <input
            id="phone"
            className="form-control"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={set('phone')}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email *</label>
          <input
            id="email"
            className="form-control"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-section-title" style={{ marginTop: '1.5rem' }}>Lead Details</div>
      <div className="form-grid form-grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="source">Lead Source *</label>
          <select
            id="source"
            className="form-control"
            value={form.source}
            onChange={set('source')}
          >
            <option value="">Select source…</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.source && <span className="form-error">{errors.source}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="status">Initial Status</label>
          <select
            id="status"
            className="form-control"
            value={form.status}
            onChange={set('status')}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="form-section-title" style={{ marginTop: '1.5rem' }}>Notes</div>
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="notes">Initial Note</label>
        <textarea
          id="notes"
          className="form-control"
          placeholder="Add context about this lead — how you met, their needs, anything useful…"
          value={form.notes}
          onChange={set('notes')}
          rows={4}
        />
        <span className="form-hint">Optional, but the more detail the better for AI suggestions.</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Add Lead'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setForm(emptyForm)}
        >
          Clear
        </button>
      </div>
    </form>
  )
}
