import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { after } from "next/server";
import { logDownload } from "@/lib/db-safe";

const EBOOK_ROOT = join(process.cwd(), "app", "ebooks");

// Each marketing material is a slug. Every download is logged to download_log by slug so we
// can see which material works. Local PDFs are served from app/ebooks (foundations-3-page is
// build-generated); the larger course PDFs live on Cloudinary and we log then redirect, so
// every download is tracked the same way regardless of where the file is hosted.
const LOCAL_SLUGS = new Set(["foundations-3-page"]);
const REMOTE_PDFS: Record<string, string> = {
  "foundations-preview-ebook":
    "https://res.cloudinary.com/devdash54321/raw/upload/v1781583653/read-your-body-data/lead-magnets/foundations-preview-ebook.pdf",
  "baseline-assessment-kit":
    "https://res.cloudinary.com/devdash54321/raw/upload/v1781583653/read-your-body-data/lead-magnets/baseline-assessment-kit.pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const isLocal = LOCAL_SLUGS.has(slug);
  const remoteUrl = REMOTE_PDFS[slug];
  if (!isLocal && !remoteUrl) {
    return new Response("Not found", { status: 404 });
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const userAgent = headerList.get("user-agent") ?? null;

  // Fire-and-forget; never blocks the download.
  after(async () => {
    await logDownload({ slug, sessionId: null, ip, userAgent });
  });

  // Remote (Cloudinary-hosted) materials: log, then redirect to the file.
  if (remoteUrl) {
    return Response.redirect(remoteUrl, 302);
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(join(EBOOK_ROOT, `${slug}.pdf`));
  } catch {
    return new Response("Ebook not generated yet. Run `npm run build:ebook`.", { status: 404 });
  }

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
