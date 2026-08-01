import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Guards the two ways an uptime probe goes wrong:
 *
 * 1. FALSE GREEN — the route returns a static 200 that never touches Postgres, so the monitor
 *    stays green through a total database outage. Sibling apps in this ecosystem shipped exactly
 *    that, so these tests assert the query is actually issued.
 * 2. CREDENTIAL LEAK — a Neon failure puts the full connection string (password included) in
 *    `err.message`, and an endpoint that echoes the error publishes it on an unauthenticated,
 *    public route. These tests assert the message never reaches the body.
 *
 * The fake connection string is ASSEMBLED AT RUNTIME, never written as a literal, per the note in
 * tests/sentry-scrub.test.ts: a literal that looks like a credential trips push protection.
 */
const FAKE_PASSWORD = ["np", "_s3", "cr3t", "P4ss"].join("");
const FAKE_CONNECTION_STRING = `${["postgres", "://"].join("")}neondb_owner:${FAKE_PASSWORD}@ep-fake-host.us-east-2.aws.neon.tech/neondb`;

const execute = vi.fn();

vi.mock("@/lib/db", () => ({
  getDb: () => ({ execute }),
}));

// Imported after the mock is registered so the route binds the fake db.
const { GET, HEAD } = await import("@/app/api/health/route");

beforeEach(() => {
  execute.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("GET /api/health", () => {
  it("actually queries the database rather than returning static JSON", async () => {
    execute.mockResolvedValue([{ "?column?": 1 }]);

    const res = await GET();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, checks: { db: "ok" } });
  });

  it("is never cached, so a monitor cannot read a stale green", async () => {
    execute.mockResolvedValue([{ "?column?": 1 }]);

    const res = await GET();

    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });

  it("returns 503 database_unreachable when the query throws", async () => {
    execute.mockRejectedValue(new Error("connection refused"));

    const res = await GET();

    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ ok: false, error: "database_unreachable" });
  });

  it("never leaks the connection string from the error message into the body", async () => {
    const leaky = new Error(`could not connect to ${FAKE_CONNECTION_STRING}`);
    execute.mockRejectedValue(leaky);

    const res = await GET();
    const body = await res.text();

    expect(res.status).toBe(503);
    expect(body).not.toContain(FAKE_PASSWORD);
    expect(body).not.toContain("neondb_owner");
    expect(body).not.toContain("could not connect");
    // The body is exactly the closed-union payload and nothing else.
    expect(JSON.parse(body)).toEqual({ ok: false, error: "database_unreachable" });
  });

  it("logs only the error class name, never the message", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    class NeonDbError extends Error {}
    execute.mockRejectedValue(new NeonDbError(FAKE_CONNECTION_STRING));

    await GET();

    const logged = errorSpy.mock.calls.flat().join(" ");
    expect(logged).toContain("NeonDbError");
    expect(logged).not.toContain(FAKE_PASSWORD);
    expect(logged).not.toContain("neondb_owner");
  });

  it("returns 503 database_timeout when the probe outruns its 4s budget", async () => {
    vi.useFakeTimers();
    // A query that never settles: only the timeout race can resolve this.
    execute.mockReturnValue(new Promise(() => {}));

    const pending = GET();
    await vi.advanceTimersByTimeAsync(4_000);
    const res = await pending;

    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ ok: false, error: "database_timeout" });
  });
});

describe("HEAD /api/health", () => {
  it("mirrors the status code with no body", async () => {
    execute.mockResolvedValue([{ "?column?": 1 }]);
    const ok = await HEAD();
    expect(ok.status).toBe(200);
    expect(await ok.text()).toBe("");

    execute.mockRejectedValue(new Error("down"));
    const down = await HEAD();
    expect(down.status).toBe(503);
    expect(await down.text()).toBe("");
  });
});
