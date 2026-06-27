// ============================================================
// Lead Service — data-access abstraction layer
// All UI components import from here, NOT from utils/storage.js directly.
// To migrate to Supabase: swap the storage imports for supabase client calls
// inside utils/storage.js. This file stays unchanged.
// ============================================================

export {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  getStats,
  getTemplates,
  initializeLeads,
} from '../utils/storage'
