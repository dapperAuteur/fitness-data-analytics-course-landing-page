# FDAC — Fitness Data Analytics Course

Lead capture for BAM's data-informed training course.

## About

Public site at [fdac.witus.online](https://fdac.witus.online). One job: capture
waitlist leads for a niche fitness-data course aimed at coaches, trainers, and
data-curious athletes. Verified submissions feed the
[CentenarianOS](https://centenarianos.com) coaching funnel — this repo stops at
"got the lead"; coaching intake, nurture, payment, and course delivery live
elsewhere. Operated by B4C LLC. Built by
[Brand Anthony McDonald](https://brandanthonymcdonald.com).

## Ecosystem positioning

| Sibling | Relationship |
|---|---|
| [CentenarianOS](https://centenarianos.com) | Coaching funnel FDAC leads feed into |
| [witus-inbox](https://inbox.witus.online) | Receives every form submission via signed HMAC webhook |
| [brandanthonymcdonald.com](https://brandanthonymcdonald.com) | BAM portfolio + other class landings |
| [WitUS.online](https://witus.online) | Ecosystem umbrella + product directory |

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 / React 19 |
| Styling | Tailwind CSS v4 |
| Database | Neon Postgres via Drizzle ORM |
| Bot gate | Google reCAPTCHA v3 (server-verify, score ≥ 0.5) |
| Inter-app messaging | HMAC-SHA256 signed webhook to inbox.witus.online |
| Ebook delivery | `@react-pdf/renderer` build-time PDF + signed HS256 JWT (24h expiry) |
| Hosting | Vercel (with Vercel Analytics) |

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — Hero, course overview, 5-week curriculum, specialization, testimonial slot, lead form, FAQ |
| `/thanks` | Post-submit success — shows the signed ebook download URL (24h expiry) |
| `/ebook/[slug]` | Verifies signed JWT, streams the PDF; never indexed |
| `/api/_*` *(reserved)* | Future server endpoints; currently none — all server work lives in App Router server actions |

## Quick start

```bash
npm install
cp .env.example .env.local                 # fill in real values; see file for the full var list
npm run build:ebook                        # generates app/ebooks/foundations-3-page.pdf
SKIP_ENV_VALIDATION=true npm run dev       # http://localhost:3000  (skip-flag is fine pre-pre-flight)
```

Once env vars are populated per
[`plans/21-fdac-ecs-rebuild-secret-provisioning.md`](./plans/21-fdac-ecs-rebuild-secret-provisioning.md),
drop `SKIP_ENV_VALIDATION=true` so the build's eager `validate-env` runs.

```bash
npm run db:push          # apply Drizzle schema to Neon
npm run db:studio        # open the Drizzle UI
```

## Project structure

```
app/
  layout.tsx, page.tsx               root layout + landing page (Server Components)
  actions.ts                         "use server" lead-submit action
  thanks/page.tsx                    post-submit page (reads ?email + ?download)
  ebook/[slug]/route.ts              JWT verify + PDF stream
  ebooks/                            generated PDFs (gitignored; built by scripts/build-ebook.tsx)
  opengraph-image.tsx, twitter-image.tsx  dynamic 1200x630 OG via next/og
  sitemap.ts, robots.ts              metadata routes (preview = robots-disallow)
components/                          Hero, CourseOverview, WeeklyBreakdown,
                                      Specialization, Testimonial, FAQ, EbookOffer,
                                      Footer, LeadForm (client w/ reCAPTCHA + RHF)
lib/
  env.ts                             Zod-validated lazy getEnv() + getEbookBaseUrl()
  db.ts                              Drizzle + @neondatabase/serverless connection
  db-safe.ts                         PII-safe upsertLead + delivery markers
  recaptcha.ts                       Google siteverify wrapper (dev-log fallback)
  inbox.ts                           HMAC-signed POST to witus-inbox (after()-friendly)
  ebook.ts                           jose-based signEbookToken/verifyEbookToken/buildEbookUrl
  ebook-doc.tsx                      @react-pdf/renderer document for the 3-page guide
db/schema.ts                         Drizzle `lead` table
scripts/
  validate-env.ts                    eager build-time check (Zod)
  build-ebook.tsx                    renders the PDF to app/ebooks/foundations-3-page.pdf
plans/                               local-only planning docs (gitignored)
```

## Deployment

Deployed on Vercel. Pushes to `main` trigger production deploys; PR branches get
preview URLs. Configure env vars in Vercel → Settings → Environment Variables
using the keys in [`.env.example`](./.env.example) and provisioning steps in
[`plans/21-fdac-ecs-rebuild-secret-provisioning.md`](./plans/21-fdac-ecs-rebuild-secret-provisioning.md).
Preview deploys should not carry live `INBOX_INGEST_*` secrets — `lib/inbox.ts`
falls back to dev-log mode without them.

```bash
npx vercel --prod    # manual production deploy
```

## License

Proprietary — B4C LLC. All rights reserved.
