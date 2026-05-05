import { config } from "dotenv";
import { z } from "zod";

// Standalone tools (tsx scripts) don't get Next's automatic .env.local loader,
// so load it explicitly. .env.local overrides .env, both are read.
config({ path: ".env.local" });
config({ path: ".env" });

const REQUIRED_ALWAYS = z.object({
  STORAGE_DATABASE_URL: z.string().min(1),
  STORAGE_DATABASE_URL_UNPOOLED: z.string().min(1),
  EBOOK_JWT_SECRET: z.string().min(32),
});

const REQUIRED_IN_PROD = z.object({
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
  INBOX_INGEST_URL: z.string().url(),
  INBOX_INGEST_SECRET: z.string().min(32),
  INBOX_SOURCE_SLUG: z.string().min(1),
  EBOOK_BASE_URL: z.string().url(),
});

const skip = process.env.SKIP_ENV_VALIDATION === "true";
const isProdLike =
  process.env.VERCEL_ENV === "production" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "production";

if (skip) {
  console.warn("[validate-env] SKIP_ENV_VALIDATION=true — skipping checks");
  process.exit(0);
}

const errors: string[] = [];

const baseResult = REQUIRED_ALWAYS.safeParse(process.env);
if (!baseResult.success) {
  for (const issue of baseResult.error.issues) {
    errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
  }
}

if (isProdLike) {
  const prodResult = REQUIRED_IN_PROD.safeParse(process.env);
  if (!prodResult.success) {
    for (const issue of prodResult.error.issues) {
      errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }
}

if (errors.length > 0) {
  console.error("[validate-env] missing or invalid environment variables:");
  console.error(errors.join("\n"));
  console.error(
    "\nProvision per plans/21-fdac-ecs-rebuild-secret-provisioning.md §A–§D, " +
      "skipping the CRM rows (out of scope for this rebuild — see plan deltas).\n" +
      "To bypass during early-rebuild local dev, set SKIP_ENV_VALIDATION=true.",
  );
  process.exit(1);
}

console.log("[validate-env] ok");
