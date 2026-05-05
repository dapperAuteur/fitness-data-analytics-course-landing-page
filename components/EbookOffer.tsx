import Link from "next/link";
import { Bell, Download } from "lucide-react";
import type { ReactNode } from "react";

const FREE_GUIDE_URL = "/ebook/foundations-3-page";

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
              Free 3-page guide
            </p>
            <h2 id="ebook-heading" className="mt-4 text-3xl font-bold sm:text-4xl">
              Two ways to start
            </h2>
            <p className="mt-4 text-lg text-cyan-50">
              Download the free guide directly. No signup. The contact form is for people who want
              an email when course enrollment opens.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-cyan-50">
              <li>The four metrics that predict longevity</li>
              <li>What devices actually measure (and what they do not)</li>
              <li>The 150 / 75 activity-minutes target, in plain English</li>
            </ul>

            <Link
              href={FREE_GUIDE_URL}
              prefetch={false}
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-cyan-700 shadow-sm transition hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Download the free guide (PDF)
            </Link>
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
