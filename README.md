# LeadFlow AI

A modern, lightweight CRM for small businesses. Track leads, log notes, manage your pipeline, and get AI-powered next-step suggestions — all in one clean interface.

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18 + Vite                       |
| Routing    | React Router v6                       |
| Styling    | Pure CSS with CSS Custom Properties   |
| Data       | LocalStorage (Supabase-ready)         |
| AI (demo)  | Rule-based suggestions (OpenAI-ready) |
| Deployment | Vercel                                |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Global navigation bar
│   ├── Footer.jsx        # Global footer
│   ├── LeadCard.jsx      # Card view for a single lead
│   ├── LeadTable.jsx     # Table view for leads list
│   ├── LeadForm.jsx      # Add lead form with validation
│   ├── StatCard.jsx      # Dashboard stat card
│   └── StatusBadge.jsx   # Colored status pill
├── pages/
│   ├── Home.jsx          # Landing / marketing page
│   ├── Login.jsx         # Sign in page
│   ├── Register.jsx      # Sign up page
│   ├── Dashboard.jsx     # Main dashboard with stats & table
│   ├── AddLead.jsx       # Add new lead page
│   └── LeadDetails.jsx   # Lead detail, notes, AI suggestion
├── styles/
│   └── globals.css       # Design system + all component styles
├── utils/
│   ├── storage.js        # LocalStorage CRUD helpers
│   └── ai.js             # AI suggestion logic (demo)
├── App.jsx               # Router configuration
└── main.jsx              # React entry point
```

## Features

- **Dashboard** — Stats overview (total, new, in-progress, closed) + searchable/filterable leads table
- **Add Lead** — Full form with validation, lead source & status selection
- **Lead Details** — View contact info, update status, add timestamped notes, delete lead
- **AI Suggestions** — Click "Get AI Suggestion" on any lead for a personalized next-step recommendation
- **Search & Filter** — Real-time search by name/email + filter by status
- **Responsive** — Works on desktop, tablet, and mobile

## Future Roadmap

- [ ] Supabase integration (real auth + database)
- [ ] OpenAI API for real AI suggestions
- [ ] Email reminders for follow-ups
- [ ] Lead import via CSV
- [ ] Team collaboration / multi-user
- [ ] Analytics & conversion charts
- [ ] Vercel deployment + custom domain
