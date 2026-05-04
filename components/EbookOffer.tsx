import { Download } from "lucide-react";
import type { ReactNode } from "react";

export function EbookOffer({ children }: { children: ReactNode }) {
  return (
    <section
      id="join-waitlist"
      aria-labelledby="ebook-heading"
      className="bg-gradient-to-br from-cyan-700 via-sky-700 to-blue-800 py-20 text-white"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/25">
              <Download className="h-4 w-4" aria-hidden="true" />
              Free 3-page guide
            </p>
            <h2 id="ebook-heading" className="mt-4 text-3xl font-bold sm:text-4xl">
              Get the foundations in your inbox
            </h2>
            <p className="mt-4 text-lg text-cyan-50">
              Join the waitlist for the next cohort. We&apos;ll email you when enrollment opens — and
              send the free 3-page guide to the four metrics that matter most for healthy aging.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-cyan-50">
              <li>• The four metrics that predict longevity</li>
              <li>• What devices actually measure (and what they don&apos;t)</li>
              <li>• The 150/75 intensity-minutes target, in plain English</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
