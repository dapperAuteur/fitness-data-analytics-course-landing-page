# FDAC — Fitness Data Analytics Course

Lead capture for BAM's data-informed training course.

## About

Public site at [fdac.witus.online](https://fdac.witus.online). One job: capture waitlist
leads for a niche fitness-data course aimed at coaches, trainers, and data-curious
athletes. Verified submissions feed the [CentenarianOS](https://centenarianos.com)
coaching funnel — this repo stops at "got the lead"; coaching intake, nurture, payment,
and course delivery live elsewhere. Operated by B4C LLC. Built by
[Brand Anthony McDonald](https://brandanthonymcdonald.com).

## Ecosystem Positioning

| Sibling | Relationship |
|---|---|
| [CentenarianOS](https://centenarianos.com) | Coaching funnel FDAC leads feed into |
| [FlashLearnAI](https://flashlearnai.witus.online) | Companion training-knowledge decks for course students |
| [brandanthonymcdonald.com](https://brandanthonymcdonald.com) | BAM portfolio + other class landings |
| [WitUS.online](https://witus.online) | Ecosystem umbrella + product directory |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 / React 19 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB via Mongoose 8 |
| Auth | NextAuth v4 (scaffolded for future admin; landing is anonymous) |
| Forms | React Hook Form + Zod |
| Bot gate | Google reCAPTCHA v3 |
| CRM + webhook | Keap REST API + Pabbly relay |
| Hosting | Vercel (with Vercel Analytics) |

## Routes

| Route | Description |
|---|---|
| `/` | Landing — hero, course overview, weekly breakdown, specialization, waitlist form, share |
| `/foundations-of-fitness-and-health-metrics-waitlist-preview-3-page-ebook` | 3-page ebook lead magnet |
| `POST /api/waitlist` | Submission endpoint: reCAPTCHA verify, Mongo write, Pabbly + Keap push |

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in real values; see file for the full var list
npm run dev                  # http://localhost:3000
```

## Project Structure

```
app/
  layout.tsx, page.tsx, globals.css   # root layout + landing page
  (ebook-pages)/                      # route group for ebook lead magnets
  api/waitlist/route.ts               # POST waitlist submission handler
components/                           # Hero, WaitlistForm, ShareSection, Footer, auth/*, ui/*
lib/
  db/dbConnect.ts                     # Mongoose connection helper
  services/waitlistService.ts         # waitlist business logic
  pabbly.ts                           # Pabbly webhook client
  tokens.ts                           # email verification tokens
logging/                              # server + client logger
models/                               # Mongoose schemas (User, WaitlistSubmission)
```

## Deployment

Deployed on Vercel. Pushes to `main` trigger production deploys; PR branches get preview
URLs. Configure env vars in Vercel → Settings → Environment Variables using the keys in
[`.env.example`](./.env.example). Preview deploys should not carry live Pabbly/Keap
secrets. Manual prod deploy: `npx vercel --prod`.

## License

Proprietary — B4C LLC. All rights reserved.
