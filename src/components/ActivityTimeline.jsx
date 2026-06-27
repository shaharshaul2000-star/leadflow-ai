import { useState } from 'react'

const ACTION_TYPES = ['General', 'Call', 'WhatsApp', 'Meeting']

const actionConfig = {
  Call:      { icon: '📞', color: '#2563EB' },
  WhatsApp:  { icon: '💬', color: '#25D366' },
  Meeting:   { icon: '🤝', color: '#8B5CF6' },
  General:   { icon: '📝', color: '#64748B' },
}

function formatDT(iso) {
  return new Date(iso).toLocaleDateString('he-IL', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ActivityTimeline({ notes = [], onAdd }) {
  const [content, setContent]     = useState('')
  const [actionType, setActionType] = useState('General')
  const [saving, setSaving]       = useState(false)

  const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleAdd = async () => {
    if (!content.trim()) return
    setSaving(true)
    await onAdd({ content: content.trim(), actionType })
    setContent('')
    setSaving(false)
  }

  const cfg = (type) => actionConfig[type] || actionConfig.General

  return (
    <div>
      {/* Add note */}
      <div className="add-note-form" style={{ marginBottom: '1.25rem' }}>
        <div className="add-note-meta">
          <select
            className="form-control"
            style={{ maxWidth: 140 }}
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            {ACTION_TYPES.map((t) => (
              <option key={t} value={t}>{cfg(t).icon} {t}</option>
            ))}
          </select>
        </div>
        <div className="add-note-row">
          <textarea
            placeholder="הוסף הערה על הפעולה האחרונה…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleAdd() }}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={!content.trim() || saving}
            style={{ alignSelf: 'flex-end', flexShrink: 0 }}
          >
            {saving ? '…' : 'הוסף'}
          </button>
        </div>
        <span className="form-hint">Tip: ⌘ + Enter להוספה מהירה</span>
      </div>

      {/* Timeline */}
      {sorted.length === 0 ? (
        <div className="timeline-empty">
          <span>📋</span>
          <p>אין פעילות עדיין. הוסף הערה ראשונה.</p>
        </div>
      ) : (
        <div className="timeline">
          {sorted.map((note, i) => {
            const { icon, color } = cfg(note.actionType)
            return (
              <div key={note.id || i} className="timeline-item">
                <div
                  className="timeline-icon"
                  style={{ color, borderColor: color + '40', background: color + '12' }}
                >
                  {icon}
                </div>
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <span className="timeline-type" style={{ color }}>{note.actionType}</span>
                    <span className="timeline-date">{formatDT(note.createdAt)}</span>
                  </div>
                  <div className="timeline-text">{note.content}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
