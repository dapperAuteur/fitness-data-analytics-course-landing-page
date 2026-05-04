import Link from "next/link";

const ecosystem = [
  { href: "https://centenarianos.com", label: "CentenarianOS coaching" },
  { href: "https://brandanthonymcdonald.com", label: "Brand Anthony McDonald" },
  { href: "https://witus.online", label: "WitUS ecosystem" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-white">
              Foundations of Fitness and Health Metrics
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              A 5-week course teaching coaches, trainers, and data-curious athletes how to turn their
              fitness data into longevity insights. Part of the World&apos;s Fastest Centenarian
              specialization.
            </p>
          </div>
          <nav aria-label="Ecosystem links">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Across the ecosystem
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {ecosystem.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    {label}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">(opens in new tab)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} B4C LLC. All rights reserved.</p>
          <p className="text-slate-500">
            Educational content for healthy adults. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
