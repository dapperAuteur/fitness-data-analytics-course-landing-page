import Link from "next/link";
import { Activity, BookOpen, Clock, Heart, Star, Target, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-900/60 px-4 py-2 text-sm font-medium ring-1 ring-cyan-300/40">
              <Star className="h-4 w-4" aria-hidden="true" />
              Part of the World&apos;s Fastest Centenarian Specialization
            </p>
            <h1 id="hero-heading" className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Read Your{" "}
              <span className="bg-gradient-to-r from-cyan-200 to-teal-200 bg-clip-text text-transparent">
                Body&apos;s Data
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cyan-50 sm:text-xl">
              Your watch already collects the four numbers that matter most for living longer.
              This 5-week, audio-first course teaches you to read them, run one simple experiment
              on yourself, and build a 90-day plan from your own data.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Clock, label: "5-Week Audio Course" },
                { icon: BookOpen, label: "Backed by Verified Research" },
                { icon: Users, label: "Free Downloads, No Email" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-900/60 px-3 py-2 text-sm ring-1 ring-cyan-300/40"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ebook/foundations-3-page"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-cyan-700 shadow-sm transition hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Download the free guide
              </Link>
              <a
                href="#join-waitlist"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-900/70 px-6 py-3 text-base font-semibold text-white ring-1 ring-cyan-200/50 transition hover:bg-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Notify me when enrollment opens
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-sm sm:p-8">
              <p className="sr-only">Sample of metrics tracked by graduates of this course.</p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: Heart, value: "72 BPM", label: "Resting Heart Rate", tone: "from-cyan-600 to-teal-700" },
                  { icon: Activity, value: "8,547", label: "Daily Steps", tone: "from-sky-600 to-cyan-700" },
                  { icon: Target, value: "150/75", label: "Activity Minutes", tone: "from-blue-600 to-sky-700" },
                  { icon: Zap, value: "87%", label: "Sleep Quality", tone: "from-teal-600 to-emerald-700" },
                ].map(({ icon: Icon, value, label, tone }) => (
                  <div
                    key={label}
                    className={`rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-sm`}
                  >
                    <Icon className="mb-3 h-7 w-7" aria-hidden="true" />
                    <div className="text-2xl font-bold sm:text-3xl">{value}</div>
                    <div className="text-xs sm:text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
