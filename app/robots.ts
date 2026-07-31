import type { MetadataRoute } from "next";

const SITE_URL = "https://fdac.witus.online";

export default function robots(): MetadataRoute.Robots {
  // Production allows indexing of the landing page. Every other deploy environment
  // (preview, dev, branch deploys) disallows everything to avoid leaking
  // unfinished copy + duplicate-content penalties.
  const isProd = process.env.VERCEL_ENV === "production";

  if (!isProd) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/thanks"],
        // The ebook URLs are public and unauthenticated by design (free, no-email lead
        // magnets). They are kept out of the index so the PDFs do not outrank the landing
        // page, not because they are access-controlled. Do not read this as a security gate.
        disallow: ["/ebook/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
