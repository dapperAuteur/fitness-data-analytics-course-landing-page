import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getEnv } from "@/lib/env";
import * as schema from "@/db/schema";

let cached: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cached) return cached;
  const env = getEnv();
  const sql = neon(env.STORAGE_DATABASE_URL);
  cached = drizzle(sql, { schema });
  return cached;
}

export { schema };
