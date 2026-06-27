const config = {
  High:   { label: '↑ High',   cls: 'priority-high' },
  Medium: { label: '→ Medium', cls: 'priority-medium' },
  Low:    { label: '↓ Low',    cls: 'priority-low' },
}

export default function PriorityBadge({ priority }) {
  const { label, cls } = config[priority] || config.Medium
  return <span className={`priority-badge ${cls}`}>{label}</span>
}
