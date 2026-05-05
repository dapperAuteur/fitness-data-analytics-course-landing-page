import { z } from "zod";

const EnvSchema = z.object({
  STORAGE_DATABASE_URL: z.string().min(1),
  STORAGE_DATABASE_URL_UNPOOLED: z.string().min(1),

  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1).optional(),
  RECAPTCHA_SECRET_KEY: z.string().min(1).optional(),

  INBOX_INGEST_URL: z.string().url().optional(),
  INBOX_INGEST_SECRET: z.string().min(32).optional(),
  INBOX_SOURCE_SLUG: z.string().min(1).default("fdac"),

  EBOOK_JWT_SECRET: z.string().min(32),
  EBOOK_BASE_URL: z.string().url().optional(),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(
      `Invalid environment variables:\n${issues}\n\nSee .env.example and plans/21-fdac-ecs-rebuild-secret-provisioning.md`,
    );
  }
  cached = parsed.data;
  return cached;
}

export function getEbookBaseUrl(): string {
  const env = getEnv();
  if (env.EBOOK_BASE_URL) return env.EBOOK_BASE_URL.replace(/\/$/, "");
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}
