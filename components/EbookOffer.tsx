import Link from "next/link";
import { Bell, Download } from "lucide-react";
import type { ReactNode } from "react";

const FREE_DOWNLOADS = [
  { slug: "foundations-3-page", title: "Quick-Start Guide", note: "3 pages, the four numbers and what they mean" },
  { slug: "foundations-preview-ebook", title: "Foundations Preview Ebook", note: "The full preview, with the research behind each metric" },
  { slug: "baseline-assessment-kit", title: "Baseline Assessment Kit", note: "A workbook to track your first week" },
];

export function EbookOffer({ children }: { children: ReactNode }) {
  return (
    <section
      id="join-waitlist"
      aria-labelledby="ebook-heading"
      className="bg-gradient-to-br from-cyan-700 via-sky-700 to-blue-800 py-20 text-white"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-cyan-900/60 px-3 py-1 text-sm font-medium ring-1 ring-cyan-300/40">
              <Download className="h-4 w-4" aria-hidden="true" />
              Free downloads, no email
            </p>
            <h2 id="ebook-heading" className="mt-4 text-3xl font-bold sm:text-4xl">
              Two ways to start
            </h2>
            <p className="mt-4 text-lg text-cyan-50">
              Download any of these directly. No signup. The contact form on the right is only for
              people who want an email when enrollment opens.
            </p>
            <ul className="mt-6 space-y-3">
              {FREE_DOWNLOADS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/ebook/${d.slug}`}
                    prefetch={false}
                    className="flex min-h-11 items-center gap-3 rounded-lg bg-white px-4 py-3 text-cyan-800 shadow-sm transition hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-left">
                      <span className="block text-base font-semibold">{d.title}</span>
                      <span className="block text-xs text-cyan-700">{d.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Course enrollment notifications
            </p>
            <p className="mt-3 text-sm text-slate-700">
              Want an email when enrollment opens? Add your details below. We will only email about
              the course, never share your data.
            </p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
