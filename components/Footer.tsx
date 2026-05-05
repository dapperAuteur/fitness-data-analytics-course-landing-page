import Link from "next/link";

const linkCls =
  "text-slate-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 rounded";

const ecosystem = [
  { href: "https://centenarianos.com", label: "CentenarianOS" },
  { href: "https://centenarianos.com/safety#rise-wellness", label: "Rise Wellness" },
  { href: "https://flashlearnai.witus.online", label: "FlashLearnAI" },
  { href: "https://brandanthonymcdonald.com", label: "Brand Anthony McDonald" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Ecosystem links" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {ecosystem.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              {label}
              <span className="sr-only"> (opens in new tab)</span>
            </Link>
          ))}
        </nav>
        <p className="text-xs text-slate-500 sm:text-right">
          © {year} FDAC. Powered by{" "}
          <a
            href="https://witus.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 rounded"
          >
            WitUS.online
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          , a B4C LLC / AwesomeWebStore.com brand. Educational content. Not medical advice.
        </p>
      </div>
    </footer>
  );
}
