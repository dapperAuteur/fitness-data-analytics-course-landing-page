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
        // Signed ebook URLs are private to each lead; keep them out of the index.
        disallow: ["/ebook/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
