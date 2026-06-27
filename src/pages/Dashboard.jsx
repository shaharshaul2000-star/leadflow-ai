import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatCard from '../components/StatCard'
import LeadTable from '../components/LeadTable'
import { getLeads, getStats } from '../services/leadService'

const CARD_FILTER_MAP = {
  total:      [],                              // empty = show all
  new:        ['New'],
  progress:   ['Contacted', 'Proposal Sent'],
  followup:   ['Follow Up'],
  closed:     ['Closed Won'],
  conversion: ['Closed Won'],
}

function SourceChart({ bySource }) {
  const total = Object.values(bySource).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const rows = Object.entries(bySource).sort((a, b) => b[1] - a[1]).slice(0, 6)
  return (
    <div className="source-chart">
      {rows.map(([src, count]) => (
        <div key={src} className="source-row">
          <span className="source-name" title={src}>{src}</span>
          <div className="source-bar-track">
            <div className="source-bar-fill" style={{ width: `${(count / total) * 100}%` }} />
          </div>
          <span className="source-count">{count}</span>
        </div>
      ))}
    </div>
  )
}

function AgendaBanner({ leads, onShow, onDismiss }) {
  const today = new Date().toISOString().split('T')[0]
  const overdue = leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate < today)
  const dueToday = leads.filter(l => l.nextFollowUpDate === today)
  const total = overdue.length + dueToday.length
  if (total === 0) return null

  const parts = []
  if (overdue.length) parts.push(`${overdue.length} פגו מועד`)
  if (dueToday.length) parts.push(`${dueToday.length} להיום`)

  return (
    <div className="agenda-banner">
      <div className="agenda-banner-left">
        <span className="agenda-icon">🔔</span>
        <div>
          <span className="agenda-title">אג'נדת היום — </span>
          <span className="agenda-desc">
            יש לך <strong>{total} לידים</strong> שמחכים למעקב ({parts.join(', ')})
          </span>
        </div>
      </div>
      <div className="agenda-banner-right">
        <button className="btn btn-primary btn-sm" onClick={onShow}>הצג לידים</button>
        <button className="btn btn-ghost btn-sm" onClick={onDismiss}>✕</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [leads, setLeads]   = useState([])
  const [stats, setStats]   = useState({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter]     = useState('All')
  const [sourceFilter, setSourceFilter]     = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [activeCard, setActiveCard]         = useState(null)
  const [showAgenda, setShowAgenda]         = useState(false)
  const [agendaDismissed, setAgendaDismissed] = useState(false)

  useEffect(() => {
    setLeads(getLeads())
    setStats(getStats())
  }, [])

  const handleCardClick = (cardType) => {
    if (activeCard === cardType) {
      setActiveCard(null)
    } else {
      setActiveCard(cardType)
      setStatusFilter('All')
      setShowAgenda(false)
    }
  }

  const handleShowAgenda = () => {
    setShowAgenda(true)
    setActiveCard(null)
    setStatusFilter('All')
    setSourceFilter('All')
    setPriorityFilter('All')
    setSearch('')
  }

  const clearAll = () => {
    setSearch('')
    setStatusFilter('All')
    setSourceFilter('All')
    setPriorityFilter('All')
    setActiveCard(null)
    setShowAgenda(false)
  }

  const today = new Date().toISOString().split('T')[0]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.businessName || '').toLowerCase().includes(q)

      let matchStatus
      if (showAgenda) {
        matchStatus = true
      } else if (activeCard) {
        const allowed = CARD_FILTER_MAP[activeCard]
        matchStatus = allowed.length === 0 || allowed.includes(l.status)
      } else {
        matchStatus = statusFilter === 'All' || l.status === statusFilter
      }

      const matchSource   = sourceFilter   === 'All' || l.source   === sourceFilter
      const matchPriority = priorityFilter === 'All' || l.priority === priorityFilter
      const matchAgenda   = !showAgenda || (l.nextFollowUpDate && l.nextFollowUpDate <= today)

      return matchSearch && matchStatus && matchSource && matchPriority && matchAgenda
    })
  }, [leads, search, statusFilter, sourceFilter, priorityFilter, activeCard, showAgenda, today])

  const activeSources = useMemo(
    () => [...new Set(leads.map((l) => l.source))].sort(),
    [leads]
  )

  const hasFilters = !!(search || statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All' || activeCard || showAgenda)

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container dashboard-page">

          {/* Header */}
          <div className="dashboard-header">
            <div>
              <div className="dashboard-title">Dashboard</div>
              <div className="dashboard-subtitle">ניהול ומעקב אחר כל הלידים שלך במקום אחד.</div>
            </div>
            <Link to="/add-lead" className="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              הוסף ליד
            </Link>
          </div>

          {/* Agenda Banner */}
          {!agendaDismissed && (
            <AgendaBanner
              leads={leads}
              onShow={handleShowAgenda}
              onDismiss={() => setAgendaDismissed(true)}
            />
          )}

          {/* 6 Stat Cards — clickable */}
          <div className="stats-grid">
            <StatCard type="total"      label="סה״כ לידים"     value={stats.total      ?? 0} sub="לחץ להצגת הכל"         onClick={() => handleCardClick('total')}      active={activeCard === 'total'} />
            <StatCard type="new"        label="לידים חדשים"     value={stats.newLeads   ?? 0} sub="ממתינים לפנייה"         onClick={() => handleCardClick('new')}        active={activeCard === 'new'} />
            <StatCard type="progress"   label="בתהליך"          value={stats.inProgress ?? 0} sub="Contacted + Proposal"   onClick={() => handleCardClick('progress')}   active={activeCard === 'progress'} />
            <StatCard type="followup"   label="מעקב"            value={stats.followUp   ?? 0} sub="Follow Up"              onClick={() => handleCardClick('followup')}   active={activeCard === 'followup'} />
            <StatCard type="closed"     label="עסקאות שנסגרו"   value={stats.closedWon  ?? 0} sub="Closed Won"             onClick={() => handleCardClick('closed')}     active={activeCard === 'closed'} />
            <StatCard type="conversion" label="אחוז המרה"       value={`${stats.conversionRate ?? 0}%`} sub="Won / Total"  onClick={() => handleCardClick('conversion')} active={activeCard === 'conversion'} />
          </div>

          {/* Active card label */}
          {activeCard && (
            <div className="active-card-hint">
              <span>מציג: <strong>{
                { total:'כל הלידים', new:'לידים חדשים', progress:'בתהליך', followup:'מעקב', closed:'Closed Won', conversion:'Closed Won' }[activeCard]
              }</strong></span>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveCard(null)}>✕ בטל</button>
            </div>
          )}
          {showAgenda && (
            <div className="active-card-hint" style={{ borderColor: '#F59E0B', background: '#FFFBEB' }}>
              <span>🔔 מציג לידים שמחכים למעקב</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAgenda(false)}>✕ בטל</button>
            </div>
          )}

          {/* Source Chart */}
          {stats.bySource && Object.keys(stats.bySource).length > 0 && (
            <div className="source-section">
              <div className="source-section-title">לידים לפי מקור</div>
              <SourceChart bySource={stats.bySource} />
            </div>
          )}

          {/* Filter Bar */}
          <div className="leads-section-header">
            <div className="leads-section-title">
              {showAgenda ? 'לידים לטיפול' : activeCard ? 'לידים מסוננים' : 'כל הלידים'}
              <span>({filtered.length})</span>
            </div>
          </div>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="חיפוש לפי שם, טלפון, אימייל, עסק…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCard(null); setShowAgenda(false) }}
              />
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setActiveCard(null); setShowAgenda(false) }}>
              <option value="All">כל הסטטוסים</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
            <select className="filter-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="All">כל המקורות</option>
              {activeSources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="All">כל העדיפויות</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearAll}>✕ נקה</button>
            )}
          </div>

          <LeadTable leads={filtered} hasFilters={hasFilters} onClear={clearAll} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
