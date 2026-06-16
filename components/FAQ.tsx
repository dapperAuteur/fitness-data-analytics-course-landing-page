const faqs = [
  {
    q: "Who is this course for?",
    a: "Any adult who owns a fitness tracker, or just a phone, and wants to actually use the data to improve their health and age well. No medical, data, or statistics background required. We start with four numbers and build from there.",
  },
  {
    q: "What devices or apps do I need?",
    a: "Any modern wearable that tracks heart rate, steps, sleep, and activity minutes works (Apple Watch, Garmin, Fitbit, Oura, Whoop), and a plain phone counts steps too. Week 2 covers what each device measures well and what to take with a grain of salt.",
  },
  {
    q: "How long does the course run?",
    a: "Five weeks, audio-first, one short concept per lesson so you can listen while you walk or drive. Each week has one assignment you do with your own logged data. By the end you have a 90-day Health Blueprint built from five weeks of your numbers.",
  },
  {
    q: "Are the claims backed by real research?",
    a: "Yes, and we show our work. Every claim is tied to a peer-reviewed study you can open and read. During the build we even corrected three mis-attributed citations and cut two claims that no real study supported. Download the Foundations Preview Ebook to see the references.",
  },
  {
    q: "Is this medical advice?",
    a: "No. The course is educational content for healthy adults learning to read their own metrics. It is not a substitute for advice from a qualified medical professional.",
  },
  {
    q: "Do I need to give my email to download the free guides?",
    a: "No. You can download every free guide directly from this page with no signup. The contact form is only for people who want an email when enrollment opens.",
  },
  {
    q: "What is the refund policy?",
    a: "All course sales are final. Read the breakdown, download the free guides, and ask any pre-purchase questions before you enroll.",
  },
];

export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 id="faq-heading" className="text-3xl font-bold sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-10 divide-y divide-slate-200">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-left text-lg font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                <dt>{q}</dt>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 rounded-full border border-slate-300 px-2 text-slate-500 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="mt-3 text-slate-600">{a}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
