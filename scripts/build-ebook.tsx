import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { FoundationsEbookDoc } from "../lib/ebook-doc";

const out = resolve(process.cwd(), "public/ebooks/foundations-3-page.pdf");

async function main() {
  await mkdir(dirname(out), { recursive: true });
  await renderToFile(<FoundationsEbookDoc />, out);
  console.log("[build-ebook] wrote", out);
}

main().catch((err) => {
  console.error("[build-ebook] failed", err);
  process.exit(1);
});
