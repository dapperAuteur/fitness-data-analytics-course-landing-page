<!-- BEGIN:nextjs-agent-rules -->
# Next.js version note

This repo is on **Next.js 15** (App Router). The ecosystem guardrail mentions a Next 16 `proxy.ts`
replacement for deprecated `middleware.ts` — that rule applies when this repo upgrades to Next 16.
Until then, the idiomatic gate is still `middleware.ts`.
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
- **Security APPLIES** — this is a data-bearing landing page (MongoDB + Pabbly + Keap). Every public form submission hits reCAPTCHA v3 server-verify. PII writes go through `lib/db-safe.ts` (to be added). Env reads go through `lib/env.ts` (to be added). Side-effect libs degrade to dev-log when env vars are missing.
- Next 15 today → `middleware.ts` idiomatic. When the repo upgrades to Next 16, rename to `proxy.ts`.
- `plans/` is gitignored. **Never commit `.env*`** except `.env.example`
- Every plan ships on its own branch. **Never push to `main`** — user reviews + pushes
- **Cross-repo edits:** branch in the sibling, user-task in origin queue for merge/push

**If you are changing something the ecosystem docs call out as another platform's job: stop and ask.**
Owned-by-someone-else list is in [`./plans/00-descriptions.md`](./plans/00-descriptions.md) §2 — coaching / health tracking / payment / LMS / nurture-automation all live elsewhere.
