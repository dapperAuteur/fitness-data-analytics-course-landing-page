import { createHmac } from "node:crypto";

// HMAC-signed POST to inbox.witus.online/api/ingest. Modeled after
// witus/lib/inbox-sender.ts:48-78. Three rules from that reference:
//   1. Sign the exact bytes you send. Don't re-serialize JSON between hashing + POSTing.
//   2. Don't block the user-facing response — caller invokes via after().
//   3. Log at most source, form_type, and HTTP status. Never log body / secret / signature.

export interface InboxSubmission {
  form_type: string;
  submitter_email?: string;
  submitter_name?: string;
  priority?: "normal" | "high";
  payload: Record<string, unknown>;
}

export interface InboxPostInput {
  formType: string;
  submitterEmail: string;
  submitterName: string;
  priority?: "normal" | "high";
  payload: Record<string, unknown>;
}

export interface InboxResult {
  ok: boolean;
  status?: number;
  detail?: string;
  id?: string;
}

export async function postToInbox(input: InboxPostInput): Promise<InboxResult> {
  const url = process.env.INBOX_INGEST_URL;
  const secret = process.env.INBOX_INGEST_SECRET;
  const slug = process.env.INBOX_SOURCE_SLUG ?? "fdac";

  if (!url || !secret) {
    console.warn("[inbox] INBOX_INGEST_{URL,SECRET} missing — dev-log mode");
    console.log("[inbox:dev]", { slug, formType: input.formType });
    return { ok: true, detail: "dev-log" };
  }

  const submission: InboxSubmission = {
    form_type: input.formType,
    submitter_email: input.submitterEmail,
    submitter_name: input.submitterName,
    priority: input.priority ?? "normal",
    payload: input.payload,
  };

  const rawBody = JSON.stringify(submission);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Witus-Source": slug,
        "X-Witus-Timestamp": timestamp,
        "X-Witus-Signature": `sha256=${signature}`,
      },
      body: rawBody,
    });
  } catch (err) {
    console.error("[inbox] fetch failed", { slug, formType: input.formType, err: scrub(err) });
    return { ok: false, detail: "fetch-failed" };
  }

  const text = await res.text();
  let body: { ok?: boolean; id?: string } = {};
  try {
    body = JSON.parse(text);
  } catch {
    /* leave empty */
  }

  if (res.ok && body.ok && body.id) {
    console.log("[inbox] ok", { slug, formType: input.formType, status: res.status });
    return { ok: true, status: res.status, id: body.id };
  }

  console.warn("[inbox] non-ok", { slug, formType: input.formType, status: res.status });
  return { ok: false, status: res.status, detail: text.slice(0, 200) };
}

function scrub(err: unknown): { name?: string; code?: string } {
  if (err && typeof err === "object") {
    const name = "name" in err && typeof err.name === "string" ? err.name : undefined;
    const code = "code" in err && typeof err.code === "string" ? err.code : undefined;
    return { name, code };
  }
  return {};
}
