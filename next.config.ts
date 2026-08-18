import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Ebook PDFs live at app/ebooks/<slug>.pdf and are read at runtime by
  // app/ebook/[slug]/route.ts via fs.readFile. Next's tracer doesn't follow
  // dynamic fs reads, so we must explicitly include them in the deployment.
  outputFileTracingIncludes: {
    "/ebook/[slug]": ["./app/ebooks/**/*.pdf"],
  },

  // PostHog's endpoints use trailing slashes (/e/, /flags/, /s/). Without this, Next
  // issues a 308 to the slashless form before the rewrite runs and ingest breaks.
  // Required by PostHog's documented Next.js proxy setup.
  //
  // SIDE EFFECT worth knowing: this disables Next's automatic trailing-slash redirect
  // for EVERY route, not just /ingest. So /thanks/ no longer 308s to /thanks and both
  // forms become reachable. This app is covered: app/layout.tsx sets
  // `alternates.canonical`, which every page inherits, so search engines still see one
  // URL. Verify that survives any future metadata refactor.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    // Reverse-proxy PostHog through our own origin. us.i.posthog.com is on uBlock
    // Origin, Brave Shields, and Safari's tracker list, so a meaningful share of
    // events never leave the browser — including, reliably, our own test visits.
    // Routing ingest through fdac.witus.online leaves blockers nothing to match on.
    //
    // Assets come from a different upstream host than ingest, hence two rules. The
    // more specific /static rule must come first.
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

// Error monitoring build plugin. Safe with no Sentry env set: without SENTRY_AUTH_TOKEN it skips
// source-map upload (you just get minified stack traces) and the runtime SDK stays inert without a
// DSN, so a deploy of this branch with no vars behaves exactly like main. org/project/authToken all
// come from env so nothing account-specific is committed here.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    // Drops the SDK's own debug logging from the bundle. This is the current option;
    // the top-level `disableLogger` it replaces is deprecated.
    treeshake: { removeDebugLogging: true },
  },
});
