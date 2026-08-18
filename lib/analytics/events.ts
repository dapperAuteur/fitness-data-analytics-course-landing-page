/**
 * Event taxonomy for the Fitness Data Analytics Course landing page (fdac.witus.online).
 *
 * The ecosystem shares ONE PostHog project, separated by the `app` property that
 * posthog-provider registers on load. Two rules keep that project readable, and both
 * are cheap now and expensive to retrofit once data has landed:
 *
 *   1. `snake_case`, object first, verb in past tense — `waitlist_submitted`.
 *   2. NEVER put the app name in the event name. `fdac_waitlist_submitted` is wrong:
 *      it makes the same action from two apps look like two events and kills the
 *      cross-app comparison that sharing a project exists to enable. The `app`
 *      property already carries that.
 *
 * Shared lifecycle events (the SHARED_EVENTS block) use identical names in every
 * ecosystem app, so "where do people fall out of sign-in" is answerable across all of
 * them at once. Do not rename these here without renaming them everywhere.
 *
 * See lib/analytics/INTEGRATE.md in the witus repo for the full contract.
 */

/** This app's ecosystem slug. Every event carries it via register({ app }). */
export const ANALYTICS_APP = "fdac-course-lp";

/**
 * Events with identical names across every ecosystem app. Names are contractual.
 *
 * This app has no sign-in surface today, so nothing here fires yet. The block stays
 * verbatim anyway: it is copied unchanged into every app so the shared funnel keeps
 * one definition, and a per-repo edit is exactly the drift the standard exists to stop.
 */
export const SHARED_EVENTS = {
  signinStarted: "signin_started",
  signinSucceeded: "signin_succeeded",
  signinFailed: "signin_failed",
} as const;

/**
 * Events specific to this landing page.
 *
 * The site has exactly one job — get people onto the course waitlist — so the number
 * that matters is the waitlist funnel: how many people who start the form finish it,
 * and where the rest fall out. That is a ratio between events, which stays valid even
 * though `persistence: "memory"` distorts absolute visitor counts (see the provider).
 */
export const EVENTS = {
  /** The waitlist form passed client validation and the server action was called. */
  waitlistStarted: "waitlist_started",
  /** The server action accepted the lead and redirected to /thanks. */
  waitlistSucceeded: "waitlist_succeeded",
  /** The server action rejected the lead. Carries a coarse `reason` code, never the
   *  error text: a storage failure's message can contain the Neon connection string,
   *  which is the leak lib/sentry-scrub.ts exists to prevent. */
  waitlistFailed: "waitlist_failed",
  /** An explicit route view. capture_pageview is off — Next's client router would
   *  fire it once and then lie — so route changes are reported deliberately. */
  routeViewed: "route_viewed",
  ...SHARED_EVENTS,
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
