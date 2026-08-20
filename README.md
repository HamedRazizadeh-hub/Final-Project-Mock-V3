# JobMatch V3

JobMatch V3 is a design/reference implementation for the third visual direction
of JobMatch. It preserves the approved V2 product logic, routes and user journey
while exploring the V3 visual identity.

This repository is a working Next.js App Router prototype, but it is not the
official production frontend.

## Important Scope

- V3 is a design/reference implementation.
- All account, profile, resume and job data is mock data only.
- There is no real authentication, backend, database or session service.
- `localStorage` is prototype-only and contains no sensitive data.
- Resume Builder is optional and separate from the core matching flow.
- There is no CV upload.
- Match and Freshness are separate concepts in the UI and data model.
- The V3 folder structure differs from the official frontend.
- Migration into the official frontend should happen feature-by-feature.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3.0 (App Router) |
| UI | React 19, TypeScript |
| Styling | Global CSS architecture with design tokens (`app/globals.css`) - no Tailwind |
| Fonts | Newsreader + Archivo via `next/font/google` |
| State | React context + prototype `localStorage` (`lib/store.tsx`) - no backend |
| Lint/format | Biome |
| Node | >= 24.19.0 (`.nvmrc`) |

## Run It

```bash
nvm use            # optional, reads .nvmrc
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # serve the build
npm run typecheck  # tsc --noEmit
npm run lint       # biome check .
npm run lint:fix   # biome check --write .
npm run format     # biome format --write .
```

The first `npm install` / `npm run dev` needs network access so `next/font`
can fetch Newsreader and Archivo. Everything else runs from local dependencies.

## Routes (Unchanged From V2)

| Route | Screen |
| --- | --- |
| `/` | Home - editorial hero for guests, personalised workspace for members |
| `/jobs` | Find Jobs - sticky filter rail, editorial result rows, filter drawer on mobile |
| `/jobs/[id]` | Job Detail - description + context, with a sticky decision panel |
| `/profile` | Match Profile - career preferences workspace |
| `/saved` | Your Job Pipeline - five tracking states |
| `/resume` | Resume Builder - optional split editor with live preview |
| `/login`, `/register` | Account prototype |

## Structure

V3 is intentionally organized as a compact reference implementation. Its folder
structure differs from the official frontend and should not be copied wholesale.

```text
app/                 routes + globals.css (the V3 design system)
components/          UI: Navbar, JobRow, FilterControls, JobDetail, ResumeSheet, ...
lib/jobs.ts          mock job data, listing-signal model
lib/match.ts         match model (skills vs. listing requirements)
lib/filters.ts       filter/sort logic and active-filter tokens
lib/store.tsx        mock member state, five job states, Match Profile, resume
public/brand/        logo system (outlined SVGs, favicon, app icon)
```

## Product Decisions Preserved

- Guest/member journey: guests search, filter, read listings and see listing
  signal; match, saving, tracking, profile and resume are member-only.
- External apply only: `Apply externally ->` opens the company site, then a
  lightweight "Did you apply?" prompt updates tracking.
- Five job states: `SAVED`, `APPLIED`, `REJECTED`, `ACCEPTED`, `DECLINED`.
- Match is separate from Freshness everywhere, visually and in the data model.
- Missing data never counts as a mismatch: the UI says "Not provided" instead.
- Low match leads to "Back to results" / "View better matches", never a failure screen.
- No CV upload. No Province filter. Home search has no location field.
- Resume Builder stays optional and never competes with Find Jobs.

## Prototype Data

The app uses clearly fake demo data for account, profile and resume examples.
Authentication is simulated in client state. The prototype stores UI state in
`localStorage` so the demo can remember saved jobs and edits between refreshes.
Do not put real personal, resume, account or credential data into this prototype.

## Design System

Tokens live at the top of `app/globals.css`:

- Surfaces: warm off-white `--bg` `#FAF7F2`, `--surface`, `--bg-band`
- Ink: `--ink` `#1A1614` through `--ink-5`
- Brand: deep aubergine `--plum` `#3E1F35`, `--plum-2` `#6B3A5E`
- Semantic: `--match` (emerald), `--fresh` (teal), `--amber`, `--terracotta`
- Radius: 9px controls, 14px panels, 20px hero surfaces
- Type: `--font-display` (Newsreader) for editorial headings, `--font-ui`
  (Archivo) for UI and tabular numbers

Colour carries meaning only: match, freshness, status, attention. Shadows are
used sparingly; structure comes from rules, background contrast and whitespace.

## Integrating Into The Official Frontend

Use V3 as a reference, not as a drop-in replacement. The official frontend has
different structure and application boundaries, so migration should happen
feature-by-feature:

1. Confirm the target feature and product behavior in the official frontend.
2. Port the relevant V3 UI/state contract for that feature only.
3. Replace mock data and `localStorage` with the official API/session/query layer.
4. Verify Match and Freshness remain separate after integration.
5. Keep Resume Builder optional and keep CV upload out of this flow.
