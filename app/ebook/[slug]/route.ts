import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { markEbookDelivered } from "@/lib/db-safe";
import { verifyEbookToken } from "@/lib/ebook";

const EBOOK_ROOT = join(process.cwd(), "app", "ebooks");

const ALLOWED_SLUGS = new Set(["foundations-3-page"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return new Response("Not found", { status: 404 });
  }

  const token = req.nextUrl.searchParams.get("t");
  if (!token) {
    return expiredResponse();
  }

  const decoded = await verifyEbookToken(token);
  if (!decoded || decoded.slug !== slug) {
    return expiredResponse();
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(join(EBOOK_ROOT, `${slug}.pdf`));
  } catch {
    return new Response("Ebook not generated yet — run `npm run build:ebook`.", { status: 404 });
  }

  // Best-effort logging of delivery; never blocks response.
  void markEbookDelivered(decoded.leadId);

  return new Response(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Length": String(pdf.length),
    },
  });
}

function expiredResponse(): Response {
  return new Response(
    "Link expired — request a fresh download from your email or by re-submitting the waitlist form.",
    { status: 401, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
