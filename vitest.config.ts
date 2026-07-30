import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests only. FDAC's testable surface is the pure helpers in lib/ (today: the Sentry scrubber),
// so the node environment is enough and no DOM shim is needed.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
