const statusMap = {
  'New':           'badge-new',
  'Contacted':     'badge-contacted',
  'Follow Up':     'badge-followup',
  'Proposal Sent': 'badge-proposalsent',
  'Closed Won':    'badge-closedwon',
  'Closed Lost':   'badge-closedlost',
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
