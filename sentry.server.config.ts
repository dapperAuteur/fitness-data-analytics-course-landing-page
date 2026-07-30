import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/sentry-scrub";

// Server-runtime error monitoring, loaded by instrumentation.ts register() on the Node runtime.
// Errors are ingested by Better Stack through the Sentry SDK, so SENTRY_DSN is the DSN Better Stack
// issues for this source (copy it from the Better Stack dashboard; never guess the ingest host).
//
// GUARDED ON THE DSN: with no SENTRY_DSN set, init never runs and the SDK is inert, so this branch
// ships and behaves exactly like main until BAM provisions the source and sets the var. Reading
// process.env directly rather than lib/env.ts is deliberate: this file loads during Next's
// instrumentation phase, before and independently of the Zod-validated getEnv(), and the same file
// shape has to work on the edge runtime.
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // Errors only. No tracing spend, and no performance data to review, until BAM opts in.
    tracesSampleRate: 0,
    // Never auto-attach IP, cookies, or a user identity. beforeSend is the second line of defence.
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
