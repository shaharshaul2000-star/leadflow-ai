# LeadFlow AI

A modern CRM for small businesses built with React + Vite. Manage leads, track activity, send WhatsApp messages, and get AI-powered next-step suggestions — all from the browser with no backend required.

---

## Features

- **Dashboard** — 6 KPI stat cards (Total, New, In Progress, Follow Up, Closed Won, Conversion Rate) + Leads by Source bar chart
- **Lead Pipeline** — 6 statuses: New → Contacted → Follow Up → Proposal Sent → Closed Won / Closed Lost
- **Priority System** — High / Medium / Low with visual badges
- **Search & Filters** — real-time search by name/phone/email/business + status/source/priority dropdowns
- **Lead Details** — inline edit of status, priority and follow-up date; WhatsApp button; copy-to-clipboard
- **Activity Timeline** — log notes with action type: Call / WhatsApp / Meeting / General
- **AI Lead Assistant** — rule-based Hebrew suggestions based on status × priority
- **WhatsApp Templates** — 3 ready-to-send message templates with `{name}` substitution → wa.me deep links
- **Responsive UI** — works on mobile, tablet and desktop
- **LocalStorage** — zero-backend, data persists in the browser; structured for easy Supabase migration

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| UI        | React 18 + Vite 5             |
| Routing   | React Router v6               |
| Styling   | Pure CSS (CSS Custom Properties) — no UI library |
| State     | React useState / useEffect / useMemo |
| Storage   | LocalStorage (abstracted via `src/services/leadService.js`) |
| AI        | Rule-based engine (`src/utils/ai.js`) |
| WhatsApp  | wa.me deep link builder (`src/utils/whatsapp.js`) |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/shaharshaul2000-star/leadflow-ai.git
cd leadflow-ai

# 2. Install
npm install

# 3. Run (dev)
npm run dev

# 4. Open
# http://localhost:5173
```

---

## Project Structure

```
leadflow-ai/
├── src/
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Auth page (UI only)
│   │   ├── Register.jsx       # Auth page (UI only)
│   │   ├── Dashboard.jsx      # KPIs + chart + filters + table
│   │   ├── AddLead.jsx        # New lead form
│   │   └── LeadDetails.jsx    # Full lead profile + timeline + AI
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── StatCard.jsx
│   │   ├── LeadTable.jsx
│   │   ├── LeadForm.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── PriorityBadge.jsx
│   │   └── ActivityTimeline.jsx
│   ├── services/
│   │   └── leadService.js     # Abstraction layer — swap for Supabase here
│   ├── utils/
│   │   ├── storage.js         # LocalStorage CRUD + seeding
│   │   ├── ai.js              # Rule-based AI suggestions (Hebrew)
│   │   └── whatsapp.js        # Phone formatting + wa.me URL builder
│   └── styles/
│       └── globals.css
├── DATA_MODEL.md              # Entity schema + ERD + future Supabase SQL
├── DESIGN.md                  # Design system documentation
└── README.md
```

---

## Demo Seed Data

On first load, 6 Hebrew leads are seeded automatically across different statuses and sources so you can explore all features immediately.

---

## Roadmap

| Feature                  | Status      |
|--------------------------|-------------|
| LocalStorage persistence | ✅ Done     |
| AI suggestions (local)   | ✅ Done     |
| WhatsApp deep links      | ✅ Done     |
| Supabase backend         | 🔜 Planned  |
| Real-time sync           | 🔜 Planned  |
| OpenAI GPT suggestions   | 🔜 Planned  |
| WhatsApp Business API    | 🔜 Planned  |
| Email integration        | 🔜 Planned  |
| Multi-user / auth        | 🔜 Planned  |
| Export to CSV            | 🔜 Planned  |

---

## License

MIT
