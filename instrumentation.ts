import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

// Next.js instrumentation hook. Loads the right error-monitoring config per runtime. This repo has
// no src/ directory, so the configs sit next to this file at the project root.
// Everything stays inert without a SENTRY_DSN (the guard lives in each config).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

// Reports errors thrown while rendering or serving a request (server actions, route handlers, RSC).
// captureRequestError does the attribution; our beforeSend scrubber strips the request body,
// cookies, IP headers, and the /ebook download token before anything is sent.
export const onRequestError: Instrumentation.onRequestError = Sentry.captureRequestError;
