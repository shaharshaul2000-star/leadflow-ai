const LEADS_KEY = 'leadflow_leads'
const INIT_KEY = 'leadflow_initialized'

const defaultLeads = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    email: 'sarah.j@techcorp.com',
    source: 'LinkedIn',
    status: 'New',
    notes: ['First contact via LinkedIn message.', 'Interested in the enterprise plan.'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    fullName: 'Michael Chen',
    phone: '+1 (555) 876-5432',
    email: 'mchen@startupxyz.io',
    source: 'Website',
    status: 'In Progress',
    notes: ['Demo scheduled for next week.', 'Needs custom API integration.'],
    createdAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '3',
    fullName: 'Emily Rodriguez',
    phone: '+1 (555) 345-6789',
    email: 'emily.r@designstudio.com',
    source: 'Referral',
    status: 'Contacted',
    notes: ['Referred by David Park.', 'Looking for a 5-seat team plan.'],
    createdAt: '2024-01-20T09:15:00Z',
  },
  {
    id: '4',
    fullName: 'David Park',
    phone: '+1 (555) 456-7890',
    email: 'd.park@globalco.net',
    source: 'Cold Call',
    status: 'Closed',
    notes: ['Signed 12-month contract.', 'Onboarding call scheduled for Feb 1st.'],
    createdAt: '2024-01-10T11:00:00Z',
  },
  {
    id: '5',
    fullName: 'Lisa Thompson',
    phone: '+1 (555) 567-8901',
    email: 'lisa.t@marketing.co',
    source: 'Event',
    status: 'New',
    notes: ['Met at SaaS Conference 2024. Very interested.'],
    createdAt: '2024-01-22T16:45:00Z',
  },
  {
    id: '6',
    fullName: 'James Wilson',
    phone: '+1 (555) 678-9012',
    email: 'jwilson@venturecap.com',
    source: 'Website',
    status: 'Lost',
    notes: ['Went with a competitor.', 'Follow up in Q3.'],
    createdAt: '2024-01-08T13:00:00Z',
  },
]

export const initializeLeads = () => {
  if (!localStorage.getItem(INIT_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(defaultLeads))
    localStorage.setItem(INIT_KEY, 'true')
  }
}

export const getLeads = () => {
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    return raw ? JSON.parse(raw) : defaultLeads
  } catch {
    return defaultLeads
  }
}

export const getLeadById = (id) => {
  return getLeads().find((l) => l.id === id) || null
}

export const saveLead = (formData) => {
  const leads = getLeads()
  const newLead = {
    id: Date.now().toString(),
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    source: formData.source,
    status: formData.status || 'New',
    notes: formData.notes ? [formData.notes] : [],
    createdAt: new Date().toISOString(),
  }
  leads.unshift(newLead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return newLead
}

export const updateLeadStatus = (id, status) => {
  const leads = getLeads()
  const index = leads.findIndex((l) => l.id === id)
  if (index !== -1) {
    leads[index].status = status
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
    return leads[index]
  }
  return null
}

export const addNote = (id, noteText) => {
  const leads = getLeads()
  const index = leads.findIndex((l) => l.id === id)
  if (index !== -1) {
    leads[index].notes = [...(leads[index].notes || []), noteText]
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
    return leads[index]
  }
  return null
}

export const deleteLead = (id) => {
  const leads = getLeads().filter((l) => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export const getStats = () => {
  const leads = getLeads()
  return {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === 'New').length,
    inProgress: leads.filter((l) => l.status === 'In Progress' || l.status === 'Contacted').length,
    closed: leads.filter((l) => l.status === 'Closed').length,
  }
}
