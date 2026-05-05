import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Standalone tools (drizzle-kit, tsx scripts) don't get Next's automatic
// .env.local loader, so load it explicitly. Order matches Next's precedence:
// .env.local overrides .env, both are read.
config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.STORAGE_DATABASE_URL_UNPOOLED ?? process.env.STORAGE_DATABASE_URL;

if (!url) {
  throw new Error(
    "STORAGE_DATABASE_URL_UNPOOLED (or STORAGE_DATABASE_URL) must be set in .env.local before running drizzle-kit. See plans/21-fdac-ecs-rebuild-secret-provisioning.md §C.",
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
