import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { REDACTED, isSensitiveName, scrubEvent, scrubText, scrubUrl } from "../lib/sentry-scrub";

/**
 * Every secret-looking fixture in this file is ASSEMBLED AT RUNTIME, never written as a string
 * literal. A literal that looks like a token or a key trips secret-scanning push protection and the
 * commit is rejected at the remote, which is a miserable way to discover the problem. Joining parts
 * produces the same value at runtime with nothing scannable in the source.
 */
const base64url = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const FAKE_JWT = [
  base64url({ alg: "HS256", typ: "JWT" }),
  base64url({ slug: "foundations-3-page", leadId: "11111111-2222-3333-4444-555555555555" }),
  ["c2ln", "bmF0", "dXJl", "LXBs", "YWNl", "aG9s", "ZGVy"].join(""),
].join(".");

const FAKE_SECRET = ["not", "-", "a", "-", "real", "-", "value", "-", "8f2c1d"].join("");
const FAKE_EMAIL = ["reader", "@", "example", ".", "com"].join("");

function makeEvent(): ErrorEvent {
  return {
    type: undefined,
    message: [
      "Lead submit failed for",
      FAKE_EMAIL,
      "with access_token=" + FAKE_SECRET,
      "and authToken=" + FAKE_SECRET,
      "while the reader was reading their resting heart rate.",
    ].join(" "),
    exception: {
      values: [
        {
          type: "TypeError",
          value: "Could not verify " + FAKE_JWT,
          stacktrace: { frames: [{ filename: "app/actions.ts", lineno: 42 }] },
        },
      ],
    },
    transaction: "POST /thanks",
    user: {
      id: "11111111-2222-3333-4444-555555555555",
      email: FAKE_EMAIL,
      ip_address: "203.0.113.7",
      username: "reader",
      segment: "waitlist",
    },
    request: {
      method: "POST",
      url: "https://fdac.witus.online/ebook/foundations-3-page?t=" + FAKE_JWT,
      query_string: ["t=" + FAKE_JWT, "email=" + encodeURIComponent(FAKE_EMAIL), "utm_source=newsletter"].join("&"),
      // A lead body. Health adjacent by construction, so the whole thing must go.
      data: {
        email: FAKE_EMAIL,
        name: "Sample Reader",
        experienceLevel: "beginner",
        restingHeartRate: 68,
      },
      cookies: { session: FAKE_SECRET },
      env: { EBOOK_JWT_SECRET: FAKE_SECRET },
      headers: {
        cookie: "sid=" + FAKE_SECRET,
        authorization: "Bearer " + FAKE_SECRET,
        "x-forwarded-for": "203.0.113.7",
        "x-api-key": FAKE_SECRET,
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X)",
        referer: "https://fdac.witus.online/thanks?email=" + encodeURIComponent(FAKE_EMAIL),
      },
    },
    breadcrumbs: [
      {
        category: "fetch",
        message: "POST /api/ingest failed, signature=" + FAKE_SECRET,
        data: {
          url: "https://inbox.witus.online/api/ingest",
          status_code: 500,
          submitter_email: FAKE_EMAIL,
          credentials: { apiKey: FAKE_SECRET, nested: { deeper: FAKE_SECRET } },
          experienceLevel: "advanced",
        },
      },
    ],
    extra: {
      lead: { email: FAKE_EMAIL, experienceLevel: "intermediate" },
      downloadUrl: "https://fdac.witus.online/ebook/foundations-3-page?t=" + FAKE_JWT,
      note: "assignment: read chapter 3",
      author: "author: Jane Doe",
      formState: "submitted",
    },
    tags: {
      route: "/thanks",
      state: "submitted",
      recaptcha_token: FAKE_SECRET,
      slug: "foundations-3-page",
    },
    contexts: {
      trace: { trace_id: "abcdef0123456789abcdef0123456789", span_id: "0123456789abcdef" },
      state: { state: { type: "form", value: { experienceLevel: "beginner" } } },
      device: { name: "iPhone", ip: "203.0.113.7" },
    },
  };
}

describe("scrubEvent", () => {
  const scrubbed = scrubEvent(makeEvent());
  const json = JSON.stringify(scrubbed);

  it("never drops the event", () => {
    expect(scrubbed).toBeTruthy();
    expect(scrubbed.exception?.values?.[0]?.type).toBe("TypeError");
  });

  it("removes every credential and address from the serialised payload", () => {
    expect(json).not.toContain(FAKE_JWT);
    // Also assert on a fragment, in case a partial rewrite left half a token behind.
    expect(json).not.toContain(FAKE_JWT.split(".")[1]);
    expect(json).not.toContain(FAKE_SECRET);
    expect(json).not.toContain(FAKE_EMAIL);
    expect(json).not.toContain("reader%40example.com");
    expect(json).not.toContain("203.0.113.7");
  });

  it("scrubs query_string, which is a separate field from url", () => {
    const query = scrubbed.request?.query_string;
    expect(typeof query).toBe("string");
    expect(query).toContain("t=" + REDACTED);
    expect(query).toContain("email=" + REDACTED);
    // Counter-assertion: marketing attribution is not a secret and stays readable.
    expect(query).toContain("utm_source=newsletter");
  });

  it("redacts the /ebook download token by path context while keeping the public slug", () => {
    expect(scrubbed.request?.url).toBe(
      "https://fdac.witus.online/ebook/foundations-3-page?t=" + REDACTED,
    );
  });

  it("strips the request body whole rather than filtering its fields", () => {
    expect(scrubbed.request?.data).toBeUndefined();
    expect(json).not.toContain("restingHeartRate");
    expect(json).not.toContain("Sample Reader");
    expect(scrubbed.request?.cookies).toBeUndefined();
    expect(scrubbed.request?.env).toBeUndefined();
  });

  it("drops credential and IP headers but keeps the useful ones", () => {
    const headers = scrubbed.request?.headers ?? {};
    expect(headers.cookie).toBeUndefined();
    expect(headers.authorization).toBeUndefined();
    expect(headers["x-forwarded-for"]).toBeUndefined();
    expect(headers["x-api-key"]).toBeUndefined();
    expect(headers["user-agent"]).toContain("iPhone");
    expect(headers.referer).toBe("https://fdac.witus.online/thanks?email=" + REDACTED);
  });

  it("removes the user identity", () => {
    expect(scrubbed.user?.email).toBeUndefined();
    expect(scrubbed.user?.ip_address).toBeUndefined();
    expect(scrubbed.user?.username).toBeUndefined();
    // Counter-assertion: the opaque id and a non-identifying attribute stay, so events still group.
    expect(scrubbed.user?.id).toBe("11111111-2222-3333-4444-555555555555");
    expect((scrubbed.user as Record<string, unknown>).segment).toBe("waitlist");
  });

  it("deep-scrubs breadcrumbs by key name, at any nesting depth", () => {
    const data = scrubbed.breadcrumbs?.[0]?.data ?? {};
    expect(scrubbed.breadcrumbs?.[0]?.message).toContain("signature=" + REDACTED);
    expect(data.submitter_email).toBe(REDACTED);
    expect(data.credentials).toBe(REDACTED);
    // Counter-assertions: the crumb is still worth reading.
    expect(data.url).toBe("https://inbox.witus.online/api/ingest");
    expect(data.status_code).toBe(500);
    expect(data.experienceLevel).toBe("advanced");
  });

  it("deep-scrubs extra and tags without flattening the harmless parts", () => {
    const extra = scrubbed.extra as Record<string, unknown>;
    const lead = extra.lead as Record<string, unknown>;
    expect(lead.email).toBe(REDACTED);
    expect(lead.experienceLevel).toBe("intermediate");
    expect(extra.downloadUrl).not.toContain(FAKE_JWT);
    expect(extra.formState).toBe("submitted");
    // `state` is not a secret and neither is prose that merely contains a secret-ish substring.
    expect(scrubbed.tags?.state).toBe("submitted");
    expect(scrubbed.tags?.slug).toBe("foundations-3-page");
    expect(scrubbed.tags?.route).toBe("/thanks");
    expect(scrubbed.tags?.recaptcha_token).toBe(REDACTED);
    expect(extra.note).toBe("assignment: read chapter 3");
    expect(extra.author).toBe("author: Jane Doe");
  });

  it("leaves contexts.trace untouched and scrubs the rest", () => {
    expect(scrubbed.contexts?.trace).toEqual({
      trace_id: "abcdef0123456789abcdef0123456789",
      span_id: "0123456789abcdef",
    });
    expect((scrubbed.contexts?.device as Record<string, unknown>).ip).toBe(REDACTED);
    expect((scrubbed.contexts?.device as Record<string, unknown>).name).toBe("iPhone");
    const state = scrubbed.contexts?.state as Record<string, unknown>;
    expect(JSON.stringify(state)).toContain("beginner");
  });

  it("keeps the message readable after scrubbing it", () => {
    const message = scrubbed.message ?? "";
    // Underscores defeat \b, so this is the assertion that proves the label boundary spans them.
    expect(message).toContain("access_token=" + REDACTED);
    expect(message).toContain("authToken=" + REDACTED);
    expect(message).toContain("Lead submit failed for");
    // Course subject matter is not PII; do not redact the vocabulary of the product.
    expect(message).toContain("resting heart rate");
  });
});

describe("scrubText counter-assertions", () => {
  it("leaves ordinary prose alone", () => {
    const samples = [
      "The assignment: read chapter 3 before Monday.",
      "author: Jane Doe",
      "Course state: published",
      "Signal strength is fine and the design: solid.",
      "Resting heart rate of 68 BPM is neither good nor bad in isolation.",
      "Turkey and monkey are not credentials.",
    ];
    for (const sample of samples) expect(scrubText(sample)).toBe(sample);
  });

  it("still catches the underscore, camelCase, and uppercase spellings", () => {
    expect(scrubText("api_key=" + FAKE_SECRET)).toBe("api_key=" + REDACTED);
    expect(scrubText("x-api-key: " + FAKE_SECRET)).toBe("x-api-key: " + REDACTED);
    expect(scrubText("apiKey=" + FAKE_SECRET)).toBe("apiKey=" + REDACTED);
    expect(scrubText("TOKEN=" + FAKE_SECRET)).toBe("TOKEN=" + REDACTED);
    expect(scrubText('{"token":"' + FAKE_SECRET + '"}')).toBe('{"token":"' + REDACTED + '"}');
  });
});

describe("isSensitiveName matches per name segment, not substring", () => {
  it("flags real credential names", () => {
    for (const name of ["access_token", "authToken", "x-api-key", "SESSION_ID", "user.email"]) {
      expect(isSensitiveName(name)).toBe(true);
    }
  });

  it("does not flag names that merely contain one", () => {
    for (const name of ["state", "statement", "monkey", "keyboard", "assignment", "signal", "zip"]) {
      expect(isSensitiveName(name)).toBe(false);
    }
  });
});

describe("scrubUrl", () => {
  it("redacts a token-shaped segment only under a token-bearing path", () => {
    const opaque = ["A1B2C3D4E5", "F6G7H8I9J0", "K1L2M3N4O5"].join("");
    expect(scrubUrl("/confirm/" + opaque)).toBe("/confirm/" + REDACTED);
    // Path context over shape: a lead id and a slug share the shape of a token but are not one.
    expect(scrubUrl("/ebook/foundations-3-page")).toBe("/ebook/foundations-3-page");
    expect(scrubUrl("/thanks?lead=11111111-2222-3333-4444-555555555555")).toBe(
      "/thanks?lead=11111111-2222-3333-4444-555555555555",
    );
  });

  it("falls back to text scrubbing for an unparseable URL", () => {
    expect(scrubUrl("not a url at all token=" + FAKE_SECRET)).toContain("token=" + REDACTED);
  });
});

describe("portability guards", () => {
  const sourceOf = (relative: string): string =>
    readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

  it("uses no regex lookbehind anywhere in the scrubber", () => {
    // `(?<=` and `(?<!` are a SyntaxError on iOS Safari below 16.4. Because the scrubber is imported
    // by instrumentation-client.ts, that would break the client chunk even with no DSN configured.
    expect(sourceOf("../lib/sentry-scrub.ts")).not.toMatch(/\(\?<[=!]/);
  });

  it("guards every Sentry init on a DSN so the SDK is inert without one", () => {
    for (const file of ["../sentry.server.config.ts", "../sentry.edge.config.ts", "../instrumentation-client.ts"]) {
      const source = sourceOf(file);
      expect(source).toMatch(/if \(dsn\) \{\s*Sentry\.init\(/);
      expect(source).toContain("tracesSampleRate: 0");
      expect(source).toContain("sendDefaultPii: false");
      expect(source).toContain("beforeSend: scrubEvent");
    }
  });
});
