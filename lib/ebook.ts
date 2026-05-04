// Phase 8 stub — replaced with signed JWT helpers.
// Current behavior: returns the unsigned ebook URL (still works locally; not safe for prod).
//
// Wire shape (Phase 8):
//   - signEbookToken({ slug, leadId }) -> JWT (HS256 over EBOOK_JWT_SECRET, exp +24h)
//   - verifyEbookToken(token) -> { slug, leadId } | throws
//   - URL: ${EBOOK_BASE_URL}/ebook/<slug>?t=<jwt>

import { getEbookBaseUrl } from "@/lib/env";

export const FOUNDATIONS_SLUG = "foundations-3-page";

export function buildEbookUrl(opts: { slug: string; leadId: string }): string {
  const base = getEbookBaseUrl();
  // Phase 8 swaps this for a JWT-signed URL.
  const t = `unsigned-${opts.leadId}`;
  return `${base}/ebook/${opts.slug}?t=${encodeURIComponent(t)}`;
}
