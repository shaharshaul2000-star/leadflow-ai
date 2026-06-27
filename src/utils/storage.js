// ============================================================
// LeadFlow AI — Data Layer v2
// Currently: LocalStorage
// Future: replace each function body with its Supabase equivalent
//   (commented inline). Function signatures stay the same —
//   no UI changes needed when migrating.
// ============================================================

const LEADS_KEY = 'lf_v2_leads'
const TEMPLATES_KEY = 'lf_v2_templates'
const INIT_KEY = 'lf_v2_initialized'

const ago = (days) => new Date(Date.now() - days * 86_400_000).toISOString()
const future = (days) =>
  new Date(Date.now() + days * 86_400_000).toISOString().split('T')[0]

// ── Seed Data ────────────────────────────────────────────────
const defaultLeads = [
  {
    id: '1',
    fullName: 'דניאל כהן',
    phone: '0521234567',
    email: 'daniel@techstartup.co.il',
    businessName: 'Tech Startup IL',
    source: 'LinkedIn',
    status: 'New',
    priority: 'High',
    nextFollowUpDate: future(1),
    notes: [
      { id: 'n1', content: 'יצר קשר דרך LinkedIn — מתעניין בפתרון CRM לצוות של 10 אנשים.', actionType: 'General', createdAt: ago(2) },
    ],
    createdAt: ago(2),
    updatedAt: ago(0),
  },
  {
    id: '2',
    fullName: 'מיכל לוי',
    phone: '0541234567',
    email: 'michal@designco.co.il',
    businessName: 'Design Studio TLV',
    source: 'Referral',
    status: 'Follow Up',
    priority: 'Medium',
    nextFollowUpDate: future(2),
    notes: [
      { id: 'n2', content: 'שיחת טלפון ראשונה — מתעניינת בחבילה חודשית.', actionType: 'Call', createdAt: ago(3) },
      { id: 'n3', content: 'שלחתי WhatsApp עם פרטים נוספים.', actionType: 'WhatsApp', createdAt: ago(1) },
    ],
    createdAt: ago(5),
    updatedAt: ago(1),
  },
  {
    id: '3',
    fullName: 'יוסי אברהם',
    phone: '0531234567',
    email: 'yossi@construct.co.il',
    businessName: 'יוסי בנייה ושיפוצים',
    source: 'Website',
    status: 'Proposal Sent',
    priority: 'High',
    nextFollowUpDate: future(1),
    notes: [
      { id: 'n4', content: 'פגישה ראשונה — הבין את הצרכים, מעוניין בפתרון לניהול לקוחות.', actionType: 'Meeting', createdAt: ago(4) },
      { id: 'n5', content: 'שלחתי הצעת מחיר מותאמת ✅', actionType: 'General', createdAt: ago(1) },
    ],
    createdAt: ago(7),
    updatedAt: ago(1),
  },
  {
    id: '4',
    fullName: 'שרה גולדברג',
    phone: '0501234567',
    email: 'sara@marketing.co.il',
    businessName: 'Marketing Pro',
    source: 'Cold Call',
    status: 'Closed Won',
    priority: 'Medium',
    nextFollowUpDate: null,
    notes: [
      { id: 'n6', content: 'סגרנו עסקה! חבילה שנתית 🎉', actionType: 'Call', createdAt: ago(2) },
    ],
    createdAt: ago(14),
    updatedAt: ago(2),
  },
  {
    id: '5',
    fullName: 'אמיר שמש',
    phone: '0581234567',
    email: 'amir@retail.co.il',
    businessName: 'חנות הרשת',
    source: 'Event',
    status: 'Contacted',
    priority: 'Low',
    nextFollowUpDate: future(5),
    notes: [
      { id: 'n7', content: 'קיבל חומר שיווקי דרך WhatsApp.', actionType: 'WhatsApp', createdAt: ago(1) },
    ],
    createdAt: ago(3),
    updatedAt: ago(1),
  },
  {
    id: '6',
    fullName: 'רחל כץ',
    phone: '0521234568',
    email: 'rachel@law.co.il',
    businessName: 'משרד עו"ד כץ',
    source: 'LinkedIn',
    status: 'Closed Lost',
    priority: 'Low',
    nextFollowUpDate: null,
    notes: [
      { id: 'n8', content: 'בחרה בספק אחר — לתזכר עוד 60 יום.', actionType: 'General', createdAt: ago(1) },
    ],
    createdAt: ago(10),
    updatedAt: ago(1),
  },
]

const defaultTemplates = [
  {
    id: 't1',
    name: 'פתיחת שיחה',
    type: 'opening',
    content: 'שלום {name}! 👋\n\nאני מ-LeadFlow AI, שמחתי לפגוש אותך!\n\nאשמח לשמוע מה הצרכים שלך ולהסביר איך אנחנו יכולים לעזור. מתי נוח לך לשיחה קצרה? 😊',
  },
  {
    id: 't2',
    name: 'מעקב — Follow Up',
    type: 'followup',
    content: 'שלום {name}!\n\nסתם רציתי לוודא שקיבלת את כל הפרטים ושיש לך תשובות לכל השאלות 😊\n\nאשמח לדבר — מתי נוח לך?',
  },
  {
    id: 't3',
    name: 'לאחר הצעת מחיר',
    type: 'proposal',
    content: 'שלום {name}!\n\nשלחתי לך הצעת מחיר לפני מספר ימים. הייתי שמח לשמוע מה דעתך ולענות על כל שאלה 🙂\n\nנוח לך לדבר היום?',
  },
]

// ── Init ─────────────────────────────────────────────────────
export const initializeLeads = () => {
  if (!localStorage.getItem(INIT_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(defaultLeads))
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(defaultTemplates))
    localStorage.setItem(INIT_KEY, 'true')
  }
}

// ── Leads CRUD ───────────────────────────────────────────────
export const getLeads = () => {
  // Supabase: await supabase.from('leads').select('*').order('createdAt', { ascending: false })
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    return raw ? JSON.parse(raw) : defaultLeads
  } catch {
    return defaultLeads
  }
}

export const getLeadById = (id) => {
  // Supabase: await supabase.from('leads').select('*').eq('id', id).single()
  return getLeads().find((l) => l.id === id) ?? null
}

export const createLead = (formData) => {
  // Supabase: await supabase.from('leads').insert({ ...data }).select().single()
  const now = new Date().toISOString()
  const newLead = {
    id: Date.now().toString(),
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    businessName: formData.businessName || '',
    source: formData.source,
    status: formData.status || 'New',
    priority: formData.priority || 'Medium',
    nextFollowUpDate: formData.nextFollowUpDate || null,
    notes: formData.notes
      ? [{ id: 'n' + Date.now(), content: formData.notes, actionType: 'General', createdAt: now }]
      : [],
    createdAt: now,
    updatedAt: now,
  }
  const leads = getLeads()
  leads.unshift(newLead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return newLead
}

export const updateLead = (id, updates) => {
  // Supabase: await supabase.from('leads').update({ ...updates, updatedAt: now }).eq('id', id)
  const leads = getLeads()
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return null
  leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() }
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return leads[idx]
}

export const deleteLead = (id) => {
  // Supabase: await supabase.from('leads').delete().eq('id', id)
  const leads = getLeads().filter((l) => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export const addNote = (leadId, note) => {
  // Supabase: await supabase.from('lead_notes').insert({ leadId, ...note })
  const leads = getLeads()
  const idx = leads.findIndex((l) => l.id === leadId)
  if (idx === -1) return null
  const newNote = {
    id: 'n' + Date.now(),
    content: note.content,
    actionType: note.actionType || 'General',
    createdAt: new Date().toISOString(),
  }
  leads[idx].notes = [...(leads[idx].notes ?? []), newNote]
  leads[idx].updatedAt = new Date().toISOString()
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return leads[idx]
}

// ── Stats ────────────────────────────────────────────────────
export const getStats = () => {
  const leads = getLeads()
  const total = leads.length
  const closedWon = leads.filter((l) => l.status === 'Closed Won').length
  const bySource = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1
    return acc
  }, {})
  return {
    total,
    newLeads: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    followUp: leads.filter((l) => l.status === 'Follow Up').length,
    proposalSent: leads.filter((l) => l.status === 'Proposal Sent').length,
    closedWon,
    closedLost: leads.filter((l) => l.status === 'Closed Lost').length,
    inProgress: leads.filter((l) => ['Contacted', 'Proposal Sent'].includes(l.status)).length,
    conversionRate: total > 0 ? Math.round((closedWon / total) * 100) : 0,
    bySource,
  }
}

// ── WhatsApp Templates ───────────────────────────────────────
export const getTemplates = () => {
  // Supabase: await supabase.from('whatsapp_templates').select('*')
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY)
    return raw ? JSON.parse(raw) : defaultTemplates
  } catch {
    return defaultTemplates
  }
}
