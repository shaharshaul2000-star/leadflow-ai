import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatCard from '../components/StatCard'
import LeadTable from '../components/LeadTable'
import { getLeads, getStats } from '../services/leadService'

const SOURCES_ORDER = ['Website','LinkedIn','Referral','Cold Call','Event','Social Media','WhatsApp','Other']

function SourceChart({ bySource }) {
  const total = Object.values(bySource).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const rows = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
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

export default function Dashboard() {
  const [leads, setLeads]   = useState([])
  const [stats, setStats]   = useState({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter]   = useState('All')
  const [sourceFilter, setSourceFilter]   = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  useEffect(() => {
    setLeads(getLeads())
    setStats(getStats())
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.businessName || '').toLowerCase().includes(q)
      const matchStatus   = statusFilter   === 'All' || l.status   === statusFilter
      const matchSource   = sourceFilter   === 'All' || l.source   === sourceFilter
      const matchPriority = priorityFilter === 'All' || l.priority === priorityFilter
      return matchSearch && matchStatus && matchSource && matchPriority
    })
  }, [leads, search, statusFilter, sourceFilter, priorityFilter])

  const activeSources = useMemo(
    () => [...new Set(leads.map((l) => l.source))].sort(),
    [leads]
  )

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

          {/* 6 Stat Cards */}
          <div className="stats-grid">
            <StatCard type="total"      label="סה״כ לידים"       value={stats.total      ?? 0} sub="כולם" />
            <StatCard type="new"        label="לידים חדשים"       value={stats.newLeads   ?? 0} sub="ממתינים לפנייה" />
            <StatCard type="progress"   label="בתהליך"            value={stats.inProgress ?? 0} sub="Contacted + Proposal" />
            <StatCard type="followup"   label="מעקב"              value={stats.followUp   ?? 0} sub="Follow Up" />
            <StatCard type="closed"     label="עסקאות שנסגרו"     value={stats.closedWon  ?? 0} sub="Closed Won" />
            <StatCard type="conversion" label="אחוז המרה"         value={`${stats.conversionRate ?? 0}%`} sub="Won / Total" />
          </div>

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
              כל הלידים
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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
            {(search || statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(''); setStatusFilter('All'); setSourceFilter('All'); setPriorityFilter('All') }}
              >
                ✕ נקה
              </button>
            )}
          </div>

          <LeadTable leads={filtered} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
