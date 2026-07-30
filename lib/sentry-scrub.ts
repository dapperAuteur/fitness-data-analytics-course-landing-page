import type { ErrorEvent } from "@sentry/nextjs";

/**
 * Sentry `beforeSend` scrubber for FDAC (error monitoring is ingested by Better Stack through the
 * Sentry SDK, so everything here runs before a single byte leaves the process).
 *
 * WHY THIS FILE IS STRICTER THAN A BROCHURE SITE NEEDS
 * ----------------------------------------------------
 * FDAC is a lead-gen funnel for a *health* course. Three things travel through it that must never
 * reach a third-party error inbox:
 *   1. Lead PII: `submitLead` accepts email + name + self-reported fitness `experienceLevel`, and
 *      `/thanks?email=<addr>` puts the email in a URL. Email plus a fitness attribute is health
 *      adjacent, not neutral analytics data.
 *   2. Bearer credentials: `/ebook/<slug>?t=<jwt>` carries an HS256 download token signed with
 *      EBOOK_JWT_SECRET, and the inbox webhook signs with INBOX_INGEST_SECRET.
 *   3. Request IPs: `app/actions.ts` and `app/ebook/[slug]/route.ts` both read x-forwarded-for.
 *
 * DECISION ON HEALTH / FITNESS DATA: we STRIP REQUEST BODIES WHOLESALE (`delete request.data`)
 * rather than filtering fields inside them. The course content itself is body-metric shaped
 * (resting heart rate, sleep efficiency, steps, activity minutes appear as demo values in
 * `lib/ebook-doc.tsx` and `components/Hero.tsx`), and a form body is the one place a real reader's
 * numbers could plausibly show up if a future field is added. A field allowlist would silently fail
 * open the day someone adds `restingHeartRate` to the lead form; dropping the body cannot. The cost
 * is low: the body of a lead POST is exactly the PII we did not want anyway, and the stack trace,
 * route, and method survive, which is what triage actually needs.
 *
 * The bias everywhere else is REDACT WHEN UNSURE. An over-redacted crash report costs one look at
 * the real request log; an under-redacted one hands a stranger a working download token or a
 * subscriber's address.
 *
 * IMPLEMENTATION CONSTRAINTS (learned the hard way, do not "simplify" these away)
 * ------------------------------------------------------------------------------
 * - NO REGEX LOOKBEHIND anywhere in this file. Lookbehind assertions are a SyntaxError on iOS
 *   Safari below 16.4, and because this module is imported by `instrumentation-client.ts` the parse
 *   error kills the whole client chunk EVEN WHEN NO DSN IS SET. Lookahead is fine, lookbehind is
 *   banned, and `tests/sentry-scrub.test.ts` greps this file to keep it that way.
 * - `\b` does NOT help with `access_token` because `_` is a word character, so there is no word
 *   boundary between `_` and `t`. Label boundaries here are spelled `[^A-Za-z0-9]`, which treats
 *   `_` as a boundary, plus a camelCase alternative for `authToken`.
 * - `request.query_string` is a SEPARATE field from `request.url`. Scrubbing the URL does not touch
 *   it, so it is scrubbed explicitly (and it may arrive as a string, an object, or pairs).
 * - Key names are matched PER NAME SEGMENT, never as substrings. `state` is not a secret,
 *   `assignment` does not contain a "sig", and `monkey` is not a "key". Only `access_token`,
 *   `authToken`, `x-api-key` and friends match.
 * - Where an id and a token share a shape (a UUID lead id vs an opaque token), PATH CONTEXT wins
 *   over shape guessing: `?t=` is redacted because it sits under `/ebook`, and `/ebook/<slug>` keeps
 *   its slug because that segment is public by design.
 */

export const REDACTED = "[redacted]";

/** Key-name segments that mean "this value is a credential". Matched per segment, not substring. */
const SECRET_NAME_SEGMENTS = new Set([
  "token",
  "tokens",
  "secret",
  "secrets",
  "password",
  "passwords",
  "passwd",
  "pwd",
  "passcode",
  "apikey",
  "key",
  "keys",
  "credential",
  "credentials",
  "cookie",
  "cookies",
  "authorization",
  "auth",
  "bearer",
  "jwt",
  "otp",
  "signature",
  "sig",
  "hmac",
  "dsn",
  "session",
  "sessionid",
  "csrf",
  "nonce",
  "recaptcha",
  "captcha",
]);

/**
 * Key-name segments that mean "this value identifies a person". Deliberately short: `name` is NOT
 * here, because Sentry uses `name` all over its own contexts (`sdk.name`, `device.name`) and the
 * only real submitter name lives in a request body, which we drop entirely.
 */
const PII_NAME_SEGMENTS = new Set([
  "email",
  "emails",
  "mail",
  "ip",
  "ipaddress",
  "phone",
  "telephone",
  "username",
]);

/** Request headers dropped outright. The IP ones are here because segment matching misses them. */
const DROPPED_HEADERS = new Set([
  "cookie",
  "set-cookie",
  "authorization",
  "proxy-authorization",
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "x-vercel-ip-country",
  "x-vercel-ip-city",
  "x-vercel-ip-latitude",
  "x-vercel-ip-longitude",
  "cf-connecting-ip",
  "true-client-ip",
  "forwarded",
]);

/**
 * Query parameters that are secret because of WHERE they appear, not because of their name or
 * shape. `t` is a one-letter name and its JWT could be mistaken for any opaque id, but under
 * `/ebook` it is the signed download token from `lib/ebook.ts`.
 */
const PATH_SCOPED_SECRET_PARAMS: ReadonlyArray<{ prefix: string; params: ReadonlySet<string> }> = [
  { prefix: "/ebook", params: new Set(["t", "token"]) },
];

/**
 * Path prefixes whose long random-looking segment IS a credential. FDAC has no such route today;
 * the list exists so a future `/confirm/<token>` is covered on the day it ships instead of the day
 * after it leaks. Note what is NOT here: `/ebook/<slug>` (a public slug) and any UUID lead id.
 */
const TOKEN_BEARING_PATH_PREFIXES = [
  "/api/auth",
  "/activate",
  "/confirm",
  "/invite",
  "/join",
  "/magic-link",
  "/reset",
  "/reset-password",
  "/set-password",
  "/unsubscribe",
];

const TOKENISH_SEGMENT_RE = /^[A-Za-z0-9_-]{20,}$/;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/**
 * A JSON Web Token. Anchored on the `eyJ` prefix (base64url of `{"`) so it cannot collide with a
 * UUID, a Neon row id, or a course slug. This is the one place shape alone is trusted, because this
 * shape has exactly one meaning.
 */
const JWT_RE = /eyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}/g;

/** Per-character case classes, so one pattern matches `token`, `Token`, and `TOKEN` without the
 *  `i` flag. The `i` flag would break the camelCase boundary below, which needs real case. */
function caseInsensitiveWord(word: string): string {
  return Array.from(word)
    .map((ch) => (/[a-z]/.test(ch) ? `[${ch}${ch.toUpperCase()}]` : ch))
    .join("");
}

const LABEL_WORDS = [
  "authorization",
  "credentials",
  "credential",
  "passphrase",
  "passcode",
  "password",
  "passwd",
  "apikey",
  "bearer",
  "secret",
  "signature",
  "session",
  "token",
  "cookie",
  "hmac",
  "jwt",
  "auth",
  "otp",
  "pwd",
  "sig",
  "dsn",
  "key",
];

/**
 * `label: value` / `label=value` in free text (a thrown message, a breadcrumb, a log line).
 *
 * Group 1 is the boundary, re-emitted verbatim. Its alternatives are: start of string, any
 * non-alphanumeric character (so `_` and `-` count, unlike `\b`), or a lowercase/digit character
 * that is immediately followed by an uppercase one (camelCase). That last alternative is a
 * LOOKAHEAD, which is safe everywhere; a lookbehind would crash older iOS Safari.
 *
 * The separator is required, and it doubles as the right-hand boundary: that is why `author: Jane`
 * survives (after `auth` comes `or`, not a separator) while `authorization: Bearer x` does not.
 */
const SECRET_LABEL_RE = new RegExp(
  "(^|[^A-Za-z0-9]|[a-z0-9](?=[A-Z]))" +
    "((?:" +
    LABEL_WORDS.map(caseInsensitiveWord).join("|") +
    ")(?:[_.-][A-Za-z0-9]+)*)" +
    '("?\\s*[:=]\\s*"?)' +
    "([^\\s\"',;&)\\]}]+)",
  "g",
);

function nameSegments(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());
}

/** True when a key name says its value is a credential or identifies a person. */
export function isSensitiveName(key: string): boolean {
  const segments = nameSegments(key);
  return segments.some((s) => SECRET_NAME_SEGMENTS.has(s) || PII_NAME_SEGMENTS.has(s));
}

function looksLikeJwt(value: string): boolean {
  JWT_RE.lastIndex = 0;
  return JWT_RE.test(value);
}

/** Scrub a free-text string: emails, JWTs, and `label: value` secrets. */
export function scrubText(text: string): string {
  return text
    .replace(EMAIL_RE, REDACTED)
    .replace(JWT_RE, REDACTED)
    .replace(
      SECRET_LABEL_RE,
      (_match, boundary: string, label: string, separator: string) =>
        `${boundary}${label}${separator}${REDACTED}`,
    );
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function isPathScopedSecretParam(pathname: string, param: string): boolean {
  const name = param.toLowerCase();
  return PATH_SCOPED_SECRET_PARAMS.some(
    (rule) => pathname.startsWith(rule.prefix) && rule.params.has(name),
  );
}

/** Redact the token-shaped segments of a path, but only under a path that is known to carry one. */
function scrubPath(pathname: string): string {
  const lower = pathname.toLowerCase();
  if (!TOKEN_BEARING_PATH_PREFIXES.some((prefix) => lower.startsWith(prefix))) return pathname;
  return pathname
    .split("/")
    .map((segment) => (TOKENISH_SEGMENT_RE.test(segment) ? REDACTED : segment))
    .join("/");
}

/**
 * Scrub a raw `a=1&b=2` query string. Operates on the undecoded pairs so a decoded `&` cannot
 * re-split the string; only the key (and a JWT sniff of the value) is decoded for the decision.
 */
function scrubRawQueryString(query: string, pathname: string): string {
  if (!query) return query;
  return query
    .split("&")
    .map((pair) => {
      if (!pair) return pair;
      const eq = pair.indexOf("=");
      const rawKey = eq === -1 ? pair : pair.slice(0, eq);
      const rawValue = eq === -1 ? "" : pair.slice(eq + 1);
      const key = safeDecode(rawKey);
      const decoded = safeDecode(rawValue);
      if (isSensitiveName(key) || isPathScopedSecretParam(pathname, key) || looksLikeJwt(decoded)) {
        return `${rawKey}=${REDACTED}`;
      }
      if (eq === -1) return pair;
      const scrubbed = scrubText(decoded);
      return scrubbed === decoded ? pair : `${rawKey}=${encodeURIComponent(scrubbed)}`;
    })
    .join("&");
}

const PLACEHOLDER_ORIGIN = "https://redacted.invalid";

function pathnameOf(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url, PLACEHOLDER_ORIGIN).pathname;
  } catch {
    return "";
  }
}

/**
 * Scrub a URL: path by context, query per key, fragment as free text. Anything that is not
 * recognisably a URL (or that URL() refuses) falls back to the free-text scrubber rather than being
 * coerced into a path, because coercion percent-encodes the string and hides labelled secrets from
 * the text pass. The result gets one final text pass as a backstop.
 */
export function scrubUrl(raw: string): string {
  const isAbsolute = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(raw);
  if (!isAbsolute && !raw.startsWith("/")) return scrubText(raw);
  let url: URL;
  try {
    url = isAbsolute ? new URL(raw) : new URL(raw, PLACEHOLDER_ORIGIN);
  } catch {
    return scrubText(raw);
  }
  const path = scrubPath(url.pathname);
  const query = scrubRawQueryString(url.search.replace(/^\?/, ""), url.pathname);
  const hash = url.hash ? scrubText(url.hash) : "";
  return scrubText(`${isAbsolute ? url.origin : ""}${path}${query ? `?${query}` : ""}${hash}`);
}

/**
 * Scrub `query_string`, which the SDK may hand us as a raw string, a plain object, or key/value
 * pairs. All three shapes are handled because all three are in the type.
 */
function scrubQueryParams(
  value: string | Record<string, string> | Array<[string, string]>,
  pathname: string,
): string | Record<string, string> | Array<[string, string]> {
  if (typeof value === "string") return scrubRawQueryString(value, pathname);
  const redactPair = (key: string, raw: string): string =>
    isSensitiveName(key) || isPathScopedSecretParam(pathname, key) || looksLikeJwt(raw)
      ? REDACTED
      : scrubText(raw);
  if (Array.isArray(value)) {
    return value.map(([key, raw]) => [key, redactPair(key, raw)] as [string, string]);
  }
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) out[key] = redactPair(key, raw);
  return out;
}

const MAX_DEPTH = 10;

/**
 * Key-aware deep scrub for breadcrumbs, `extra`, `tags`, and `contexts`. Two rules, in order:
 * a key whose NAME is sensitive loses its whole value whatever the type (a nested object under
 * `credentials` is not saved by scrubbing its leaves), and every surviving string is scrubbed as
 * free text. Cycles and runaway depth are cut rather than followed.
 */
function deepScrub(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (typeof value === "string") return scrubText(value);
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return REDACTED;
  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) return value.map((item) => deepScrub(item, depth + 1, seen));

  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    out[key] = isSensitiveName(key) ? REDACTED : deepScrub(item, depth + 1, seen);
  }
  return out;
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (typeof event.message === "string") event.message = scrubText(event.message);
  if (event.logentry?.message) event.logentry.message = scrubText(event.logentry.message);
  if (typeof event.transaction === "string") event.transaction = scrubText(event.transaction);

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = scrubText(exception.value);
  }

  // Never ship the account identity or the network origin. `sendDefaultPii: false` should already
  // prevent most of this; this is the second line of defence, not the first.
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
    for (const key of Object.keys(event.user)) {
      if (isSensitiveName(key)) delete (event.user as Record<string, unknown>)[key];
    }
  }

  if (event.request) {
    const request = event.request;
    const pathname = pathnameOf(request.url);
    if (typeof request.url === "string") request.url = scrubUrl(request.url);
    // Separate field from `url`: scrubbing one does nothing for the other.
    if (request.query_string !== undefined) {
      request.query_string = scrubQueryParams(request.query_string, pathname);
    }
    // The health/fitness decision: bodies go, whole, rather than field by field.
    delete request.data;
    delete request.cookies;
    delete request.env;
    if (request.headers) {
      for (const [key, headerValue] of Object.entries(request.headers)) {
        const lower = key.toLowerCase();
        if (DROPPED_HEADERS.has(lower) || isSensitiveName(key)) {
          delete request.headers[key];
          continue;
        }
        if (typeof headerValue !== "string") continue;
        request.headers[key] =
          lower === "referer" || lower === "referrer" ? scrubUrl(headerValue) : scrubText(headerValue);
      }
    }
  }

  for (const breadcrumb of event.breadcrumbs ?? []) {
    if (breadcrumb.message) breadcrumb.message = scrubText(breadcrumb.message);
    if (breadcrumb.data) {
      breadcrumb.data = deepScrub(breadcrumb.data) as Record<string, unknown>;
    }
  }

  if (event.extra) event.extra = deepScrub(event.extra) as Record<string, unknown>;

  if (event.tags) {
    for (const [key, tagValue] of Object.entries(event.tags)) {
      if (isSensitiveName(key)) event.tags[key] = REDACTED;
      else if (typeof tagValue === "string") event.tags[key] = scrubText(tagValue);
    }
  }

  if (event.contexts) {
    for (const [key, context] of Object.entries(event.contexts)) {
      // `contexts.trace` is exempt: it is ids and span metadata, and rewriting it breaks the
      // trace/span linkage Sentry needs to group the event at all.
      if (key === "trace" || !context) continue;
      event.contexts[key] = deepScrub(context) as Record<string, unknown>;
    }
  }

  return event;
}
