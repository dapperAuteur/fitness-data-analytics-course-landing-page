// Phase 6 stub — replaced with HMAC-signed POST to inbox.witus.online/api/ingest.
// Current behavior: dev-log only.
//
// Wire shape (Phase 6):
//   - HMAC-SHA256 over `${timestamp}.${rawBody}` using INBOX_INGEST_SECRET
//   - Headers: X-Witus-Source, X-Witus-Timestamp, X-Witus-Signature: sha256=<hex>
//   - Body: { form_type, submitter_email, submitter_name, priority, payload }
//   - Caller invokes via after() so the failure mode never blocks the user
// Reference: witus/lib/inbox-sender.ts:48-78

interface InboxPayload {
  formType: string;
  submitterEmail: string;
  submitterName: string;
  priority: "normal" | "high";
  payload: Record<string, unknown>;
}

export async function postToInbox(input: InboxPayload): Promise<{ ok: boolean; detail?: string }> {
  const url = process.env.INBOX_INGEST_URL;
  const secret = process.env.INBOX_INGEST_SECRET;
  const slug = process.env.INBOX_SOURCE_SLUG ?? "fdac";

  if (!url || !secret) {
    console.warn("[inbox] INBOX_INGEST_{URL,SECRET} missing — dev-log mode");
    console.log("[inbox:dev]", { slug, ...input });
    return { ok: true, detail: "dev-log" };
  }
  // Phase 6 implements the real HMAC POST here.
  console.warn("[inbox] Phase 6 not yet wired — would POST to", url, "with slug", slug);
  console.log("[inbox:phase6-pending]", input);
  return { ok: true, detail: "phase6-pending" };
}
