import Link from "next/link";

// FDAC ecosystem footer. Mirrors fly.witus.online's footer structure
// (centered brand → Rise Wellness callout → 3-column nav → B4C
// attribution) but uses FDAC's cyan palette instead of fly's sky.
//
// Sibling product list is duplicated here rather than imported because
// each WitUS app is a separate repo. When the ecosystem changes,
// update this file alongside the canonical list in
// gemini/witus/lib/products.ts.

interface SiblingProduct {
  name: string;
  href: string;
}

const SIBLING_PRODUCTS: SiblingProduct[] = [
  { name: "WitUS.online", href: "https://witus.online" },
  { name: "CentenarianOS", href: "https://centenarianos.com" },
  { name: "Work.WitUS", href: "https://work.witus.online" },
  { name: "Tour Manager OS", href: "https://tour.witus.online" },
  { name: "Wanderlearn", href: "https://wanderlearn.witus.online" },
  { name: "FlashLearnAI", href: "https://flashlearnai.witus.online" },
  { name: "Fly.WitUS", href: "https://fly.witus.online" },
  { name: "Learn.WitUS", href: "https://centenarianos.com/academy" },
  { name: "AwesomeWebStore", href: "https://awesomewebstore.com" },
];

const linkClasses =
  "inline-flex items-center min-h-[28px] text-slate-600 hover:text-cyan-700 hover:underline transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 rounded";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700">FDAC</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            Foundations of Fitness and Health Metrics
          </p>
          <p className="mt-1 text-xs text-slate-600">
            5-week course · Coaches, trainers, data-curious athletes
          </p>
        </div>

        <RiseWellnessCallout />

        <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-slate-900">Ecosystem</p>
            <ul className="space-y-1">
              {SIBLING_PRODUCTS.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    {p.name}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 font-semibold text-slate-900">FDAC</p>
            <ul className="space-y-1">
              <li>
                <Link href="/" className={linkClasses}>
                  Course overview
                </Link>
              </li>
              <li>
                <Link href="/ebook/foundations-3-page" prefetch={false} className={linkClasses}>
                  Free 3-page guide
                </Link>
              </li>
              <li>
                <Link href="/#join-waitlist" className={linkClasses}>
                  Notify me
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 font-semibold text-slate-900">Partners &amp; Legal</p>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://www.centenarianos.com/safety#rise-wellness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Rise Wellness
                  <span className="sr-only"> (wellness partner — opens in new tab)</span>
                </a>
                <p className="text-xs leading-tight text-slate-600">Wellness partner</p>
              </li>
              <li className="pt-2">
                <a
                  href="https://witus.online/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://witus.online/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Privacy
                </a>
              </li>
              <li>
                <a href="mailto:bam@awews.com" className={linkClasses}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-700">
          <p>
            © {year} B4C LLC · A{" "}
            <a
              href="https://awesomewebstore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-cyan-700 hover:underline"
            >
              AwesomeWebStore.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>{" "}
            brand. Educational content. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Mental-health-support callout — mirrors the Rise Wellness section at
 * https://www.centenarianos.com/safety#rise-wellness so the same partner
 * surface appears across the WitUS ecosystem. Independent provider; the
 * non-affiliation disclaimer is mandatory and stays verbatim aside from
 * the FDAC product-name substitution.
 */
function RiseWellnessCallout() {
  return (
    <section
      aria-labelledby="rise-wellness-heading"
      className="mb-8 rounded-lg border border-cyan-100 bg-cyan-50/60 p-5 text-sm"
    >
      <header className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
          Mental health support
        </p>
        <h2 id="rise-wellness-heading" className="text-base font-semibold text-slate-900">
          Rise Wellness of Indiana
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Independent mental health provider · Not affiliated with FDAC
        </p>
      </header>

      <p className="leading-relaxed text-slate-700">
        Rise Wellness of Indiana provides compassionate, personalized, holistic mental health care.
        Evidence-based medicine, trauma-informed care, and a whole-person approach to help you heal,
        grow, and thrive in mind, body, and spirit.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Services
          </p>
          <ul className="space-y-0.5 text-xs text-slate-700">
            <li>ADHD testing &amp; management (in-person or remote)</li>
            <li>Anxiety &amp; depression</li>
            <li>Maternal mental health</li>
            <li>Medication management</li>
            <li>GeneSight® genetic testing</li>
            <li>Behavioral therapy &amp; coaching</li>
            <li>Routine lab testing</li>
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Visit or call
          </p>
          <address className="text-xs not-italic leading-relaxed text-slate-700">
            320 North Meridian Street
            <br />
            Indianapolis, IN 46204
            <br />
            Mon–Sat by appointment · Sun closed
          </address>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
            <a
              href="tel:+13179650299"
              className="inline-flex min-h-[28px] items-center rounded font-medium text-cyan-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              317-965-0299
            </a>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <a
              href="https://risewellnessofindiana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[28px] items-center rounded font-medium text-cyan-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              risewellnessofindiana.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <a
              href="https://www.centenarianos.com/safety#rise-wellness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[28px] items-center rounded font-medium text-cyan-700 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Full safety page
              <span className="sr-only"> on centenarianos.com (opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-cyan-300 pl-3 text-xs italic text-slate-700">
        &ldquo;At Rise Wellness, we believe everyone has the capacity to rise above challenges and
        live a fulfilling, healthy life. Our care is guided by the belief that healing is personal,
        holistic, and rooted in compassion.&rdquo;
        <span className="mt-1 block not-italic text-slate-600">Rise Wellness of Indiana</span>
      </blockquote>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
        Rise Wellness of Indiana is an independent organization. They are not affiliated with,
        employed by, or endorsed by FDAC, CentenarianOS, B4C LLC, AwesomeWebStore.com, or Anthony
        McDonald. We are grateful for their collaboration on mental health safety resources for our
        community.
      </p>
    </section>
  );
}
