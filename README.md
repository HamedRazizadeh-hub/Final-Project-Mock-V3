# JobMatch V3

The third visual direction for JobMatch — an editorial career marketplace with a
personal career dashboard — built on the approved V2 product logic, routes and
user journey.

This is a real Next.js App Router codebase, not a mockup.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3.0 (App Router) |
| UI | React 19, TypeScript |
| Styling | Global CSS architecture with design tokens (`app/globals.css`) — no Tailwind |
| Fonts | Newsreader + Archivo via `next/font/google` |
| State | React context + `localStorage` (`lib/store.tsx`) — no backend required |
| Node | >= 24.19.0 (`.nvmrc`) |

## Run it

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
npm run lint       # next lint
```

The first `npm install` / `npm run dev` needs network access so `next/font`
can fetch Newsreader and Archivo. Everything else runs offline.

## Routes (unchanged from V2)

| Route | Screen |
| --- | --- |
| `/` | Home — editorial hero for guests, personalised workspace for members |
| `/jobs` | Find Jobs — sticky filter rail, editorial result rows, filter drawer on mobile |
| `/jobs/[id]` | Job Detail — description + context, with a sticky decision panel |
| `/profile` | Match Profile — career preferences workspace |
| `/saved` | Your Job Pipeline — five tracking states |
| `/resume` | Resume Builder — optional split editor with live preview |
| `/login`, `/register` | Account |

## Structure

```
app/                 routes + globals.css (the design system)
components/          UI: Navbar, JobRow, FilterControls, JobDetail, ResumeSheet, …
lib/jobs.ts          job data, listing-signal model
lib/match.ts         match model (skills vs. listing requirements)
lib/filters.ts       filter/sort logic and active-filter tokens
lib/store.tsx        member state, five job states, Match Profile, resume
public/brand/        logo system (outlined SVGs, favicon, app icon)
```

## Product decisions preserved

- Guest/member journey: guests search, filter, read listings and see listing
  signal; match, saving, tracking, profile and resume are member-only.
- External apply only — `Apply externally →` opens the company site, then a
  lightweight "Did you apply?" prompt updates tracking.
- Five job states: `SAVED`, `APPLIED`, `REJECTED`, `ACCEPTED`, `DECLINED`.
- Match is separate from freshness, everywhere, visually and in the data model.
- Missing data never counts as a mismatch — the UI says "Not provided" instead.
- Low match → "Back to results" / "View better matches", never a failure screen.
- No CV upload. No Province filter. Home search has no location field.
- Resume Builder stays an optional tool, never competing with Find Jobs.

## Design system

Tokens live at the top of `app/globals.css`:

- Surfaces: warm off-white `--bg` `#FAF7F2`, `--surface`, `--bg-band`
- Ink: `--ink` `#1A1614` through `--ink-5`
- Brand: deep aubergine `--plum` `#3E1F35`, `--plum-2` `#6B3A5E`
- Semantic: `--match` (emerald), `--fresh` (teal), `--amber`, `--terracotta`
- Radius: 9px controls, 14px panels, 20px hero surfaces
- Type: `--font-display` (Newsreader) for editorial headings, `--font-ui`
  (Archivo) for UI and tabular numbers

Colour carries meaning only — match, freshness, status, attention. Shadows are
used twice in the whole app; structure comes from rules, background contrast and
whitespace.

## Integrating into the official frontend

`lib/` is framework-agnostic apart from `store.tsx`. To adopt the visual layer
only, copy `app/globals.css` plus `components/`, then point `lib/jobs.ts` at
your real API and replace `lib/store.tsx` with your session/query layer — the
`MatchProfile` and `JobState` types are the contract the UI expects.
