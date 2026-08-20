import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // FDAC: rebuild rollback archive (gitignored; never linted)
    "_archive/**",
  ]),
  {
    // lib/analytics/* is a byte-for-byte copy of the ecosystem standard maintained in
    // the witus repo, audited by scripts/check-posthog-conformance.mjs there. Editing
    // it here is exactly the drift that checker exists to catch, so the exemption lives
    // in this config instead of as a disable comment inside the copied file.
    //
    // The rule fires on `setReady(true)` when posthog-js is already loaded. That is the
    // supported "subscribe to an external system" case the rule's own docs carve out:
    // posthog.__loaded is external state, and the alternative — reading __loaded during
    // render — makes the first pageview of every visit depend on whether a minified
    // dependency sets that flag synchronously. Under React 16.1's ruleset this passed;
    // it only became an error in the 16.2 config bump.
    files: ["lib/analytics/**/*.{ts,tsx}"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
]);

export default eslintConfig;
