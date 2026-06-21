# LeadFlow AI — Design System

## Design Philosophy

Clean, fast, and trustworthy. LeadFlow AI uses a minimal design language that lets the data speak — no noise, no clutter. Every decision prioritizes readability and action over decoration.

---

## Color Palette

| Token           | Hex       | Usage                                  |
|-----------------|-----------|----------------------------------------|
| `--primary`     | `#2563EB` | CTAs, links, active states, highlights |
| `--primary-dark`| `#1D4ED8` | Primary button hover state             |
| `--primary-light`| `#EFF6FF`| Primary tinted backgrounds             |
| `--secondary`   | `#64748B` | Secondary text, muted labels           |
| `--bg`          | `#F8FAFC` | App background                         |
| `--surface`     | `#FFFFFF` | Cards, modals, panels                  |
| `--text`        | `#0F172A` | Primary text (near-black)              |
| `--text-muted`  | `#64748B` | Secondary text, timestamps             |
| `--text-light`  | `#94A3B8` | Placeholders, tertiary labels          |
| `--border`      | `#E2E8F0` | Card/input borders                     |
| `--success`     | `#22C55E` | Closed deals, success states           |
| `--warning`     | `#F59E0B` | In-progress, warnings                  |
| `--danger`      | `#EF4444` | Delete, lost leads, errors             |

---

## Status Colors

| Status      | Text Color | Background  | Meaning                    |
|-------------|------------|-------------|----------------------------|
| New         | `#2563EB`  | `#EFF6FF`   | Added, not yet contacted   |
| Contacted   | `#8B5CF6`  | `#F5F3FF`   | Outreach made              |
| In Progress | `#92400E`  | `#FFFBEB`   | Active conversation        |
| Closed      | `#15803D`  | `#F0FDF4`   | Deal won                   |
| Lost        | `#B91C1C`  | `#FFF1F2`   | Deal lost                  |

---

## Typography

```
Font Family:  'Inter', Arial, sans-serif
```

| Scale       | Size       | Weight | Usage                        |
|-------------|------------|--------|------------------------------|
| Display     | clamp(2.4rem, 6vw, 4rem) | 800 | Hero heading |
| H1          | 1.65rem    | 800    | Page titles                  |
| H2          | 1.3rem     | 800    | Auth card title              |
| H3          | 1.1rem     | 700    | Section headings             |
| Body        | 1rem       | 400    | Default text                 |
| Body SM     | 0.875rem   | 400    | Table cells, descriptions    |
| Label       | 0.85rem    | 600    | Form labels                  |
| Caption     | 0.78rem    | 400    | Hints, timestamps            |
| Micro       | 0.75rem    | 600    | Badges, table headers        |

---

## Spacing Scale

Based on a 4px base unit:

```
4px   → 0.25rem  (tight gap, badge padding)
8px   → 0.5rem   (small gap)
12px  → 0.75rem  (compact padding)
16px  → 1rem     (standard padding)
20px  → 1.25rem  (card padding)
24px  → 1.5rem   (section gap)
32px  → 2rem     (page section)
48px  → 3rem     (hero spacing)
```

---

## Border Radius

| Token          | Value   | Usage                        |
|----------------|---------|------------------------------|
| `--radius-sm`  | `6px`   | Small buttons, tags          |
| `--radius`     | `10px`  | Inputs, standard buttons     |
| `--radius-lg`  | `14px`  | Cards, panels                |
| `--radius-xl`  | `20px`  | Modals, auth card            |
| `--radius-full`| `9999px`| Pills, badges                |

---

## Shadows

```css
--shadow-xs:  0 1px 2px rgba(15,23,42,0.06)
--shadow-sm:  0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06)
--shadow:     0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.06)
--shadow-md:  0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.06)
--shadow-lg:  0 20px 25px rgba(15,23,42,0.10), 0 8px 10px rgba(15,23,42,0.06)
```

Used progressively: `xs` for navbars, `sm` for cards at rest, `md` for cards on hover, `lg` for modals/auth cards.

---

## Component Patterns

### Buttons
```
Primary   — blue fill, white text, blue border
Secondary — white fill, dark text, grey border
Danger    — red tinted fill, red text → red fill on hover
Ghost     — transparent, muted text, no border
```
All buttons use 0.18s ease transitions and `translateY(-1px)` on hover for lift effect.

### Cards
White surface, 1px `--border` border, `--radius-lg`, `--shadow-sm` at rest, `--shadow-md` on hover with subtle translateY.

### Form Fields
1.5px border, `--radius` corners, 3px ring glow on focus using `--primary-ring: rgba(37,99,235,0.25)`.

### Status Badges
Pill shape (`--radius-full`), colored dot, background tinted to match status, uppercase micro text.

---

## Page Layouts

| Page         | Layout                        |
|--------------|-------------------------------|
| Home         | Full-width hero + feature grid |
| Login/Register | Centered auth card (420px max) |
| Dashboard    | Container, full-width grid/table |
| Add Lead     | 2-col (form + sidebar)        |
| Lead Details | 2-col (main + sidebar 360px)  |

Breakpoints:
- `1024px` — side columns collapse to stacked
- `768px`  — mobile nav (hamburger), hide table columns
- `480px`  — single-column stats, stacked buttons

---

## Motion

```
--transition: 0.18s ease
```

Consistent across all interactive elements. Hover states use `transform: translateY(-1px)` for cards and `translateY(-2px)` for prominent cards, creating a tactile lift feel.

Animations:
- `pulse` — status dot for "live" indicators
- `spin` — AI loading spinner
- `slideIn` — toast notifications
- `modalIn` — modal scale-in entry

---

## Iconography

All icons are inline SVG using the `currentColor` stroke pattern from Feather Icons style:
- `strokeWidth="2"` standard
- `strokeLinecap="round"`
- `strokeLinejoin="round"`
- Size: 16px in buttons/labels, 22px in stat cards, 24px in modals
