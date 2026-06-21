const statusMap = {
  'New':         'badge-new',
  'Contacted':   'badge-contacted',
  'In Progress': 'badge-inprogress',
  'Closed':      'badge-closed',
  'Lost':        'badge-lost',
}

export default function StatusBadge({ status }) {
  const cls = statusMap[status] || 'badge-new'
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}
