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
| Error monitoring | Better Stack, ingested via `@sentry/nextjs` (opt-in: inert without a DSN) |
| Tests | Vitest (`npm test`) |
| Hosting | Vercel (with Vercel Analytics) |

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — Hero, course overview, 5-week curriculum, specialization, testimonial slot, lead form, FAQ |
| `/thanks` | Post-submit success — shows the signed ebook download URL (24h expiry) |
| `/ebook/[slug]` | Verifies signed JWT, streams the PDF; never indexed |
| `/api/health` | Uptime probe: `select 1` against Postgres. `GET` and `HEAD`, public, never cached |

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
npm test                 # Vitest unit tests (lib/ helpers, incl. the Sentry scrubber)
```

## Health check

`GET /api/health` (and `HEAD /api/health`) is the endpoint uptime monitors should watch.
**Point Better Stack at `/api/health`, not at `/`.** The homepage can serve a cached 200
from the CDN while the database behind the lead form is down, so a green check on `/`
proves only that the CDN is up.

| State | Status | Body |
|---|---|---|
| Database reachable | `200` | `{"ok":true,"checks":{"db":"ok"}}` |
| Database unreachable, or the probe exceeds 4s | `503` | `{"ok":false,"error":"database_unreachable"}` |

`HEAD` returns the same status code with no body.

What it does and, more importantly, what it does not:

- It runs exactly one query, `select 1`. It never reads, returns, or counts a `lead` or
  `download_log` row, and it reports no number of any kind. Nothing in the response implies
  how many leads exist. This is a health-adjacent funnel on a public unauthenticated route,
  so even a row count is more than a monitor needs.
- It calls **no third-party API** — no email provider, no reCAPTCHA, no Cloudinary. A
  vendor outage must not redden the monitor, because none of those take the funnel down
  the way Postgres does.
- It **never echoes the underlying error**. A Neon failure carries the connection string
  (password included) in its message, so the `catch` takes no binding, the response body is
  a fixed literal, and the server log line is a constant string.
- It is never cached: `force-dynamic`, `revalidate = 0`, and `Cache-Control: no-store` on
  every response.
- The probe is capped at **4 seconds** via `Promise.race`, so a hung connection fails the
  check instead of hanging the monitor until its own timeout.

## Error monitoring

Crash reporting goes to **Better Stack**, which ingests through the Sentry SDK, so the
wiring is the standard `@sentry/nextjs` set: `instrumentation.ts` (server + edge
`register()` and `onRequestError`), `instrumentation-client.ts` (browser init and
`onRouterTransitionStart`), `sentry.server.config.ts`, `sentry.edge.config.ts`, and
`app/global-error.tsx` for crashes in the root layout itself.

**It is opt-in and inert by default.** Every `Sentry.init` is wrapped in a DSN guard, so
with no `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` set nothing initialises, nothing is sent,
and the build behaves exactly as it did before. Tracing and session replay are pinned to
`0`: errors only, no performance spend, and no recording of a visitor typing their email
into the lead form. Set the vars per [`.env.example`](./.env.example) to switch it on.

Everything is filtered through `lib/sentry-scrub.ts` (`beforeSend`) before leaving the
process. It removes emails and JWTs from message text, redacts values whose key name is a
credential (matched per name segment, so `access_token` is caught and `state` is not),
redacts the `/ebook?t=` download token by path context, drops cookies, auth headers, and
IP headers, and **strips request bodies whole** rather than filtering fields inside them,
because this is a health-adjacent funnel and a field allowlist fails open the day someone
adds a body-metric field to the lead form. The file header explains each decision, and
[`tests/sentry-scrub.test.ts`](./tests/sentry-scrub.test.ts) asserts both that secrets are
gone and that ordinary data is not over-redacted.

There is **no Content-Security-Policy** in this repo today (no `headers()` in
`next.config.ts`, no `vercel.json`, no proxy), so nothing needed a `connect-src`
allowance. If a CSP is added later, append the DSN origin to `connect-src` only when a DSN
is actually configured.

## Project structure

```
instrumentation.ts                   Next instrumentation hook: loads the per-runtime
                                      error-monitoring config + onRequestError
instrumentation-client.ts            browser error-monitoring init + onRouterTransitionStart
sentry.server.config.ts              Node-runtime init (DSN-guarded, errors only)
sentry.edge.config.ts                edge-runtime init (DSN-guarded, errors only)
app/
  layout.tsx, page.tsx               root layout + landing page (Server Components)
  global-error.tsx                   root error boundary; reports the crash, offers retry
  actions.ts                         "use server" lead-submit action
  thanks/page.tsx                    post-submit page (reads ?email + ?download)
  ebook/[slug]/route.ts              JWT verify + PDF stream
  api/health/route.ts                uptime probe: select 1, no PII, no vendor calls
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
  sentry-scrub.ts                    beforeSend scrubber (PII, tokens, bodies, headers)
db/schema.ts                         Drizzle `lead` table
tests/sentry-scrub.test.ts           Vitest coverage for the scrubber (both directions)
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
