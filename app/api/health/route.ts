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
//   password included, in its `message`, so the response body is built only from the closed
//   `ProbeResult` union below and the server log line carries only the error's CLASS NAME.
//   `err.message` must never be logged or returned here.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const TIMEOUT_MS = 4_000;

const NO_STORE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

/** Raised only by our own timeout race, so a slow database reads differently from a dead one. */
class ProbeTimeoutError extends Error {
  constructor() {
    super("probe timeout");
    this.name = "ProbeTimeoutError";
  }
}

/**
 * The complete set of values that may ever reach the response body. Anything the database
 * throws is collapsed into one of these, which is what keeps a connection string from
 * escaping: there is no code path that copies error text into the payload.
 */
type ProbeResult = "ok" | "database_timeout" | "database_unreachable";

/**
 * `select 1` against Postgres, capped at TIMEOUT_MS so a hung connection fails the check
 * instead of hanging the monitor until its own timeout.
 */
async function probeDatabase(): Promise<ProbeResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new ProbeTimeoutError()), TIMEOUT_MS);
    });
    await Promise.race([getDb().execute(sql`select 1`), timeout]);
    return "ok";
  } catch (err) {
    // Class name ONLY (e.g. "NeonDbError", "ProbeTimeoutError"). Never `err.message` — that
    // is the field a Neon connection failure fills with postgres://user:pass@host.
    const errorClass =
      err instanceof Error ? err.constructor?.name || err.name : typeof err;
    console.error(`[health] database probe failed (${errorClass})`);
    return err instanceof ProbeTimeoutError ? "database_timeout" : "database_unreachable";
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(): Promise<Response> {
  const result = await probeDatabase();
  if (result !== "ok") {
    return new Response(JSON.stringify({ ok: false, error: result }), {
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
  const result = await probeDatabase();
  return new Response(null, { status: result === "ok" ? 200 : 503, headers: NO_STORE_HEADERS });
}
