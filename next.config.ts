import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Ebook PDFs live at app/ebooks/<slug>.pdf and are read at runtime by
  // app/ebook/[slug]/route.ts via fs.readFile. Next's tracer doesn't follow
  // dynamic fs reads, so we must explicitly include them in the deployment.
  outputFileTracingIncludes: {
    "/ebook/[slug]": ["./app/ebooks/**/*.pdf"],
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
