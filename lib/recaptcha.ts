const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(
  token: string | null | undefined,
  action?: string,
  remoteIp?: string | null,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[recaptcha] RECAPTCHA_SECRET_KEY missing — dev-log mode, returning true");
    return true;
  }
  if (!token) {
    console.warn("[recaptcha] missing token");
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    console.error("[recaptcha] siteverify fetch failed", err);
    return false;
  }

  if (!res.ok) {
    console.error("[recaptcha] siteverify non-2xx", res.status);
    return false;
  }

  const data = (await res.json()) as RecaptchaResponse;
  if (!data.success) {
    console.warn("[recaptcha] failed", { errors: data["error-codes"] });
    return false;
  }
  if (typeof data.score === "number" && data.score < MIN_SCORE) {
    console.warn("[recaptcha] low score", { score: data.score, action: data.action });
    return false;
  }
  if (action && data.action && data.action !== action) {
    console.warn("[recaptcha] action mismatch", { expected: action, got: data.action });
    return false;
  }
  return true;
}
