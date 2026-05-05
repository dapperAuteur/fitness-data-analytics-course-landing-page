import Link from "next/link";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; download?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";
  const downloadUrl = params.download ?? "";

  return (
    <main id="main" className="flex flex-1 items-center justify-center bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-4 py-20 text-white">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">You&apos;re on the list</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Thanks{email ? `, ${email}` : ""}.</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your free 3-page guide is ready below. The link expires in 24 hours. Download it now and
          save the PDF locally so you can refer back to it anytime.
        </p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Download the foundations guide (PDF)
          </a>
        )}
        <p className="mt-6 text-sm text-slate-500">
          We&apos;ll also email you when enrollment opens for the next cohort. In the meantime, browse
          the rest of the ecosystem:{" "}
          <Link
            href="https://centenarianos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-cyan-700 hover:underline"
          >
            CentenarianOS coaching
          </Link>{" "}
          ·{" "}
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
