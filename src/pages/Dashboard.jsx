import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatCard from '../components/StatCard'
import LeadTable from '../components/LeadTable'
import { getLeads, getStats } from '../utils/storage'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState({ total: 0, newLeads: 0, inProgress: 0, closed: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    setLeads(getLeads())
    setStats(getStats())
  }, [])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.fullName.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search)
      const matchStatus = statusFilter === 'All' || l.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [leads, search, statusFilter])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container dashboard-page">

          {/* Header */}
          <div className="dashboard-header">
            <div>
              <div className="dashboard-title">
                Dashboard
                <span>Manage and track all your leads in one place.</span>
              </div>
            </div>
            <Link to="/add-lead" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Lead
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              type="total"
              label="Total Leads"
              value={stats.total}
              sub="All time"
            />
            <StatCard
              type="new"
              label="New Leads"
              value={stats.newLeads}
              sub="Awaiting contact"
            />
            <StatCard
              type="progress"
              label="In Progress"
              value={stats.inProgress}
              sub="Active conversations"
            />
            <StatCard
              type="closed"
              label="Closed Deals"
              value={stats.closed}
              sub="Successfully converted"
            />
          </div>

          {/* Leads Table */}
          <div>
            <div className="leads-section-header">
              <div className="leads-section-title">
                All Leads
                <span>({filtered.length})</span>
              </div>
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search leads…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
            <LeadTable leads={filtered} />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
