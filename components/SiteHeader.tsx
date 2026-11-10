import Link from "next/link";

/**
 * The landing page's own header: the course mark linking home, plus the same links the footer's
 * "FDAC" column uses. It renders on the home page and on the error pages so a lost visitor sees the
 * site's shell (witus docs/shared-ui-ux-dx.md, "Error pages keep the app shell"). This site has no
 * accounts, so there is no Sign in control.
 */
const NAV_LINKS = [
  { href: "/#join-waitlist", label: "Notify me" },
  { href: "/ebook/foundations-3-page", label: "Free 3-page guide", prefetch: false },
] as const;

const navLinkClasses =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-slate-700 hover:text-cyan-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700">FDAC</span>
          <span className="font-semibold text-slate-900">Read Your Body&apos;s Data</span>
        </Link>
        <nav aria-label="Site" className="-mx-3 flex flex-wrap items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={"prefetch" in link ? link.prefetch : undefined}
              className={navLinkClasses}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
