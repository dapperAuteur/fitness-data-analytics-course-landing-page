<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (Next 16) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# FDAC (Fitness Data Analytics Course) — agent instructions

**Read order before writing any code:**

1. [`./plans/ecosystem/README.md`](./plans/ecosystem/README.md) — ecosystem platform index + Redundancy Test
2. [`./plans/ecosystem/fitness-data-analytics-course-landing-page.md`](./plans/ecosystem/fitness-data-analytics-course-landing-page.md) — this product's one-job definition
3. [`./plans/00-descriptions.md`](./plans/00-descriptions.md) — non-negotiables, coding style, git workflow, verification
4. [`./plans/user-tasks/00-descriptions.md`](./plans/user-tasks/00-descriptions.md) — operator task queue; pointer to canonical witus queue for ecosystem tasks
5. Workflow descriptors: bugs · future · validate · reports (in `./plans/`)
6. The specific `./plans/NN-*.md` plan you are executing

**Hard rules (grep in [`./plans/00-descriptions.md`](./plans/00-descriptions.md)):**

- Mobile-first 360px, ARIA-compliant, keyboard-reachable, focus rings visible
- TypeScript strict. Server Components by default; `"use client"` only when needed
- **Security APPLIES** — this is a data-bearing landing page (Neon Postgres + signed inbox webhook). Every public form submission hits Google reCAPTCHA v3 server-verify. PII writes go through `lib/db-safe.ts`. Env reads go through `lib/env.ts` (Zod-validated, lazy). Side-effect libs (recaptcha, inbox webhook) degrade to dev-log when env vars are missing.
- **Stack (post-rebuild 2026-05-04):** Next 16 + Drizzle + Neon Postgres + reCAPTCHA v3 + signed HMAC webhook to `inbox.witus.online`. **No Mongoose, no NextAuth, no Pabbly, no Keap** (Keap is on the backlog).
- Next 16: use `proxy.ts`, not `middleware.ts`. FDAC has no auth-gated routes today, so no proxy.ts is needed yet.
- `plans/` is gitignored. **Never commit `.env*`** except `.env.example`. `_archive/` is gitignored (rebuild rollback safety; safe to delete after the rebuild branch merges).
- Every plan ships on its own branch. **Never push to `main`** — user reviews + pushes
- **Cross-repo edits:** branch in the sibling, user-task in origin queue for merge/push

**Local port convention:** FDAC dev runs on `localhost:3000`; witus-inbox dev runs on `localhost:3001`. Local `INBOX_INGEST_URL = http://localhost:3001/api/ingest`.

**If you are changing something the ecosystem docs call out as another platform's job: stop and ask.** Owned-by-someone-else list is in [`./plans/00-descriptions.md`](./plans/00-descriptions.md) §2 — coaching / health tracking / payment / LMS / nurture-automation all live elsewhere.
