import Link from "next/link";

const FREE_GUIDE_URL = "/ebook/foundations-3-page";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <main
      id="main"
      className="flex flex-1 items-center justify-center bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-4 py-20 text-white"
    >
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          You are on the list
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Thanks{email ? `, ${email}` : ""}.
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          We will email you when course enrollment opens for the next cohort. No other emails, ever.
        </p>
        <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-6">
          <p className="text-sm font-semibold text-cyan-900">
            Did you grab the free guide yet?
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The 3-page foundations guide is a separate download. No email needed.
          </p>
          <Link
            href={FREE_GUIDE_URL}
            prefetch={false}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Download the free guide (PDF)
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Browse the rest of the ecosystem:{" "}
          <Link
            href="https://centenarianos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-cyan-700 hover:underline"
          >
            CentenarianOS coaching
          </Link>{" "}
          and{" "}
          <Link
            href="https://brandanthonymcdonald.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-cyan-700 hover:underline"
          >
            Brand Anthony McDonald
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
