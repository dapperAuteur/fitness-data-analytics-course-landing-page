import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { after } from "next/server";
import { logDownload } from "@/lib/db-safe";

const EBOOK_ROOT = join(process.cwd(), "app", "ebooks");

const ALLOWED_SLUGS = new Set(["foundations-3-page"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return new Response("Not found", { status: 404 });
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(join(EBOOK_ROOT, `${slug}.pdf`));
  } catch {
    return new Response("Ebook not generated yet. Run `npm run build:ebook`.", { status: 404 });
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const userAgent = headerList.get("user-agent") ?? null;

  // Fire-and-forget; never blocks the download.
  after(async () => {
    await logDownload({ slug, sessionId: null, ip, userAgent });
  });

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
