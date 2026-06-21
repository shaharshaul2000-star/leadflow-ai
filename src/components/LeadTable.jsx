import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function LeadTable({ leads }) {
  const navigate = useNavigate()

  if (!leads || leads.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          <div className="table-empty-icon">📋</div>
          <p style={{ fontWeight: 600, marginBottom: '0.35rem' }}>No leads found</p>
          <p>Try adjusting your search or add a new lead.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Status</th>
            <th>Source</th>
            <th>Added</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const color = getColor(lead.fullName)
            return (
              <tr key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)}>
                <td>
                  <div className="table-name-cell">
                    <div className="table-avatar" style={{ background: color }}>
                      {getInitials(lead.fullName)}
                    </div>
                    <div className="table-name-info">
                      <span className="table-name-primary">{lead.fullName}</span>
                      <span className="table-name-secondary">{lead.email}</span>
                    </div>
                  </div>
                </td>
                <td><StatusBadge status={lead.status} /></td>
                <td style={{ color: 'var(--text-muted)' }}>{lead.source}</td>
                <td style={{ color: 'var(--text-muted)' }}>{formatDate(lead.createdAt)}</td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {lead.notes?.length || 0} note{lead.notes?.length !== 1 ? 's' : ''}
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/lead/${lead.id}`) }}
                    style={{ color: 'var(--primary)' }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
