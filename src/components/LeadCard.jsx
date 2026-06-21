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

export default function LeadCard({ lead }) {
  const navigate = useNavigate()
  const color = getColor(lead.fullName)

  return (
    <div className="lead-card" onClick={() => navigate(`/lead/${lead.id}`)}>
      <div className="lead-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="lead-card-avatar" style={{ background: color }}>
            {getInitials(lead.fullName)}
          </div>
          <div>
            <div className="lead-card-name">{lead.fullName}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{lead.source}</div>
          </div>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="lead-card-meta">
        <div className="lead-card-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {lead.email}
        </div>
        <div className="lead-card-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          {lead.phone}
        </div>
      </div>

      <div className="lead-card-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          {formatDate(lead.createdAt)}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {lead.notes?.length || 0} note{lead.notes?.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
