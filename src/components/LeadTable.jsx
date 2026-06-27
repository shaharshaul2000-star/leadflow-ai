import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

const avatarColors = ['#2563EB','#8B5CF6','#EC4899','#F59E0B','#10B981','#EF4444','#06B6D4','#84CC16']

function getColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return avatarColors[Math.abs(h) % avatarColors.length]
}

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

function FollowUpTag({ date }) {
  if (!date) return <span className="followup-tag normal">—</span>
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(date)
  const diff = Math.round((d - today) / 86_400_000)
  if (diff < 0) return <span className="followup-tag overdue">⚠ {Math.abs(diff)}d overdue</span>
  if (diff === 0) return <span className="followup-tag soon">🔔 Today</span>
  if (diff <= 2)  return <span className="followup-tag soon">📅 {formatDate(date)}</span>
  return <span className="followup-tag normal">📅 {formatDate(date)}</span>
}

export default function LeadTable({ leads, onClear, hasFilters = false }) {
  const navigate = useNavigate()

  if (!leads || leads.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          <div className="table-empty-icon">🔍</div>
          <p style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text)' }}>
            {hasFilters ? 'לא נמצאו לידים תואמים' : 'אין לידים עדיין'}
          </p>
          <p style={{ marginBottom: hasFilters ? '1rem' : 0 }}>
            {hasFilters ? 'נסה לשנות את הפילטרים או לחפש מחרוזת אחרת.' : 'הוסף ליד ראשון כדי להתחיל לעקוב.'}
          </p>
          {hasFilters && onClear && (
            <button className="btn btn-secondary btn-sm" onClick={onClear}>
              ✕ נקה פילטרים
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>ליד</th>
            <th>סטטוס</th>
            <th>עדיפות</th>
            <th>מקור</th>
            <th>מעקב הבא</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)}>
              <td>
                <div className="table-name-cell">
                  <div className="table-avatar" style={{ background: getColor(lead.fullName) }}>
                    {getInitials(lead.fullName)}
                  </div>
                  <div className="table-name-info">
                    <span className="table-name-primary">{lead.fullName}</span>
                    <span className="table-name-secondary">
                      {lead.businessName || lead.email}
                    </span>
                  </div>
                </div>
              </td>
              <td><StatusBadge status={lead.status} /></td>
              <td><PriorityBadge priority={lead.priority} /></td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{lead.source}</td>
              <td><FollowUpTag date={lead.nextFollowUpDate} /></td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/lead/${lead.id}`) }}
                  style={{ color: 'var(--primary)' }}
                >
                  פרטים →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
