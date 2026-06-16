import { ShieldCheck, FileSearch, Link2 } from "lucide-react";

const points = [
  {
    icon: FileSearch,
    title: "Every source checked",
    body: "Each citation was verified against Crossref and PubMed. We even cut two claims that no real study supported, and corrected three that named the wrong author.",
  },
  {
    icon: Link2,
    title: "Links you can open",
    body: "The course lists every study behind it, with a link to read the paper yourself. No vague \"studies show.\"",
  },
  {
    icon: ShieldCheck,
    title: "Honest about limits",
    body: "Where the evidence is thin, we say so in plain words instead of dressing a guess up as a fact.",
  },
];

export function VerifiedResearch() {
  return (
    <section aria-labelledby="research-heading" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-cyan-900/60 px-4 py-2 text-sm font-medium ring-1 ring-cyan-300/40">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Backed by verified research
          </p>
          <h2 id="research-heading" className="mt-4 text-3xl font-bold sm:text-4xl">
            Every claim, backed by research you can check
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Health advice online is full of round numbers no one can trace. This course is the
            opposite. We show the receipts.
          </p>
        </div>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {points.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-2xl bg-slate-800/60 p-6 ring-1 ring-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600">
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
