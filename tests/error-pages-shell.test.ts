import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Error pages keep the app shell (witus docs/shared-ui-ux-dx.md). This landing page has no accounts,
 * so the shell is SiteHeader + Footer; the 404 and the route error boundary must render both, with
 * one h1 and a link home, and the home page must render the same header.
 */
const read = (rel: string) => readFileSync(new URL(`../${rel}`, import.meta.url), "utf-8");

describe("error pages keep the app shell", () => {
  for (const file of ["app/not-found.tsx", "app/error.tsx"]) {
    it(`${file} renders SiteHeader, Footer, one h1 and a home link`, () => {
      const src = read(file);
      expect(src).toMatch(/<SiteHeader \/>/);
      expect(src).toMatch(/<Footer \/>/);
      expect(src.match(/<h1/g)).toHaveLength(1);
      expect(src).toMatch(/href="\/"/);
    });
  }

  it("the home page renders the same header", () => {
    expect(read("app/page.tsx")).toMatch(/<SiteHeader \/>/);
  });
});
