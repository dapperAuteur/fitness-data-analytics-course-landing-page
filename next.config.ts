import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ebook PDFs are now public assets at public/ebooks/<slug>.pdf — Next serves
  // them directly with no special tracer-include needed. The legacy signed-JWT
  // route at app/ebook/[slug]/route.ts still reads from app/ebooks/ if anyone
  // pre-existing JWT URLs land; the include below preserves that fallback path
  // and is safe to remove once those URLs are confirmed extinct.
  outputFileTracingIncludes: {
    "/ebook/[slug]": ["./app/ebooks/**/*.pdf"],
  },
};

export default nextConfig;
