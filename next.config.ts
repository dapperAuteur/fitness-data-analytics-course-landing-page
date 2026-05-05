import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ebook PDFs live at app/ebooks/<slug>.pdf and are read at runtime by
  // app/ebook/[slug]/route.ts via fs.readFile. Next's tracer doesn't follow
  // dynamic fs reads, so we must explicitly include them in the deployment.
  outputFileTracingIncludes: {
    "/ebook/[slug]": ["./app/ebooks/**/*.pdf"],
  },
};

export default nextConfig;
