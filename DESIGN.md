# LeadFlow AI — Design System

## Design Philosophy

Clean, fast, and trustworthy. LeadFlow AI uses a minimal design language that lets the data speak — no noise, no clutter. Every decision prioritizes readability and action over decoration.

---

## Color Tokens (CSS Custom Properties)

```css
--primary:       #2563EB   /* Blue — primary actions, links */
--primary-dark:  #1D4ED8   /* Hover state */
--primary-light: #EFF6FF   /* Light backgrounds */

--success:       #10B981   /* Green — closed won, positive */
--success-dark:  #059669
--success-bg:    #ECFDF5

--warning:       #F59E0B   /* Amber — follow up, medium priority */
--warning-bg:    #FFFBEB

--danger:        #EF4444   /* Red — delete, overdue, high priority */
--danger-bg:     #FEF2F2

--text:          #0F172A   /* Main text */
--text-muted:    #64748B   /* Secondary text */

--surface:       #FFFFFF   /* Cards */
--bg:            #F8FAFC   /* Page background */
--border:        #E2E8F0   /* Dividers */
```

---

## Typography

- **Font family**: `Inter`, `system-ui`, `sans-serif`
- **Direction**: RTL (`dir="rtl"` on `<html>`)
- **Scale**: 0.75rem (xs) → 0.8rem → 0.875rem → 1rem → 1.1rem → 1.25rem → 1.75rem (page titles)
- **Weights**: 400 (body), 600 (label), 700 (heading), 800 (hero)

---

## Layout

- **Container**: `max-width: 1280px`, centered, `padding: 0 1.5rem`
- **Page wrapper**: `min-height: 100vh`, flex-column with sticky footer
- **Spacing scale**: 0.35 / 0.5 / 0.65 / 0.75 / 0.85 / 1 / 1.1 / 1.25 / 1.5 / 1.75 / 2rem

---

## Components

### Buttons

| Class           | Usage                        |
|-----------------|------------------------------|
| `.btn-primary`  | Main CTA (blue)              |
| `.btn-secondary`| Secondary actions (gray)     |
| `.btn-danger`   | Destructive (red)            |
| `.btn-ghost`    | Tertiary / clear filters     |
| `.btn-whatsapp` | WhatsApp action (green)      |
| `.btn-sm`       | Smaller button variant       |
| `.btn-full`     | Full-width button            |

### Status Badges

| Status         | Class                   | Color   |
|----------------|-------------------------|---------|
| New            | `.badge-new`            | Blue    |
| Contacted      | `.badge-contacted`      | Purple  |
| Follow Up      | `.badge-followup`       | Amber   |
| Proposal Sent  | `.badge-proposalsent`   | Indigo  |
| Closed Won     | `.badge-closedwon`      | Green   |
| Closed Lost    | `.badge-closedlost`     | Red/Gray|

### Priority Badges

| Priority | Class             | Color  |
|----------|-------------------|--------|
| High     | `.priority-high`  | Red    |
| Medium   | `.priority-medium`| Orange |
| Low      | `.priority-low`   | Green  |

### Follow-Up Tags

| State   | Class                     | Appearance          |
|---------|---------------------------|---------------------|
| Overdue | `.followup-tag.overdue`   | Red, ⚠ Xd overdue  |
| Today   | `.followup-tag.soon`      | Amber, 🔔 Today     |
| Future  | `.followup-tag.normal`    | Gray, 📅 date       |

---

## Cards

All cards use the same shell:
```
background: var(--surface)
border: 1px solid var(--border)
border-radius: 12px (--radius-lg)
box-shadow: var(--shadow-sm)
```

Special variants:
- **AI card**: gradient `primary-light → #E0EAFF`, blue border
- **WhatsApp card**: white, green border accent
- **Danger zone**: red-tinted background, red border

---

## Stat Cards (Dashboard)

6-card grid, 3 columns × 2 rows, collapses to 2-col at 768px and 1-col at 480px.

Each card has:
- Icon circle (color varies by type)
- Large number value
- Label + sub-label

---

## Activity Timeline

Notes sorted newest-first. Each item:
- Circle icon (emoji, colored border matching action type)
- Action type label + timestamp
- Note body text

Action colors:
- Call → `#2563EB` (blue)
- WhatsApp → `#25D366` (green)
- Meeting → `#8B5CF6` (purple)
- General → `#64748B` (gray)

---

## WhatsApp UI

- `.wa-btn` — green pill button (`#25D366`), white text
- Templates card shows: template name, message preview, Open WhatsApp button
- Links open `https://wa.me/972XXXXXXXXX?text=...` in new tab

---

## Lead Details Layout

Two-column grid: `1fr 340px` sidebar. Collapses to single column at 1024px.

Left column:
1. Lead info card (avatar, name, badges, meta grid, inline edit selects)
2. Activity timeline card

Right sidebar:
1. AI suggestion card
2. WhatsApp templates card
3. Quick summary card
4. Danger zone

---

## Forms

- `.form-grid-2` — 2-column grid
- `.form-grid-3` — 3-column grid (collapses to 1-col on mobile)
- `.form-label` — 0.8rem, font-weight 600
- `.form-control` — full-width, 0.875rem, 40px height for inputs
- `.form-error` — red inline error below field
- `.form-hint` — gray helper text

---

## Responsive Breakpoints

| Breakpoint | Change                                      |
|------------|---------------------------------------------|
| `≤ 1024px` | Details grid → single column                |
| `≤ 768px`  | Stats grid 3-col → 2-col; nav collapses     |
| `≤ 640px`  | Filter bar stacks vertically; table scrolls |
| `≤ 480px`  | Stats grid → 1-col; form grids → 1-col      |

---

## Animations

| Name      | Usage                        |
|-----------|------------------------------|
| `fadeIn`  | Page entry, card appear      |
| `spin`    | AI spinner, loading states   |
| `slideIn` | Toast notification entry     |
