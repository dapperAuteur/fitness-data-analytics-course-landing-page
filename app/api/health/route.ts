import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

// Uptime probe for Better Stack (and any other monitor). It must be honest and boring:
//
// - It really touches the one critical dependency (Postgres) with the cheapest possible
//   query, `select 1`. A cached homepage can return 200 while the database is down; this
//   route cannot.
// - It touches NOTHING else. No email provider, no reCAPTCHA, no Cloudinary. A vendor
//   outage must not redden this monitor, because none of those can take the funnel down
//   the way the database can.
// - It never reads, returns, or counts a `lead` or `download_log` row, and never reports a
//   row count or any other number that implies volume. This app holds fitness-shaped
//   personal data (email, name, experience level, IP, user agent), and an unauthenticated
//   public endpoint is the wrong place to leak even the shape of it.
// - It never echoes the underlying error. A Neon failure carries the connection string,
//   password included, in its message, so the catch below takes no binding at all and the
//   response body is a fixed literal.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const TIMEOUT_MS = 4_000;

const NO_STORE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

/**
 * `select 1` against Postgres, capped at TIMEOUT_MS so a hung connection fails the check
 * instead of hanging the monitor until its own timeout.
 */
async function probeDatabase(): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
    });
    await Promise.race([getDb().execute(sql`select 1`), timeout]);
    return true;
  } catch {
    // Deliberately unbound: the error object can contain the connection string.
    // Constant string only, never the message.
    console.error("[health] database probe failed");
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(): Promise<Response> {
  const ok = await probeDatabase();
  if (!ok) {
    return new Response(JSON.stringify({ ok: false, error: "database_unreachable" }), {
      status: 503,
      headers: NO_STORE_HEADERS,
    });
  }
  return new Response(JSON.stringify({ ok: true, checks: { db: "ok" } }), {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}

// Monitors that use HEAD get the same status code with no body.
export async function HEAD(): Promise<Response> {
  const ok = await probeDatabase();
  return new Response(null, { status: ok ? 200 : 503, headers: NO_STORE_HEADERS });
}
