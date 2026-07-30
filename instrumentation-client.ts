import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/sentry-scrub";

// Client-runtime error monitoring. Reads the PUBLIC DSN, which is inlined into the browser bundle at
// build time, so it is the Better Stack DSN meant to be public (the same trust model as the
// reCAPTCHA site key). Guarded: with no NEXT_PUBLIC_SENTRY_DSN the SDK never initialises, nothing is
// sent, and the page behaves exactly as it does today.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    // Errors only. No tracing, and no session replay: replay would record a visitor typing their
    // email into the lead form, which is exactly the data this repo is careful with.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}

// Instruments App Router client navigations (no-op when the SDK was never initialised).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
