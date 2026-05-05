const faqs = [
  {
    q: "Who is this course for?",
    a: "Coaches, trainers, and data-curious athletes who want to turn fitness-tracker data into actionable training decisions. No prior data-science background required — we start with the four foundational metrics and build from there.",
  },
  {
    q: "What devices or apps do I need?",
    a: "Any modern wearable that tracks heart rate, steps, sleep, and intensity minutes (Apple Watch, Garmin, Fitbit, Oura, Whoop, etc.). Week 2 covers device selection and accuracy validation in detail.",
  },
  {
    q: "How long does the course run?",
    a: "Five weeks, with one module released per week. Each module includes a guided exercise you complete with your own data — by the end you have a personal optimization protocol.",
  },
  {
    q: "Is this medical advice?",
    a: "No. The course is educational content for healthy adults learning to interpret their own metrics. It is not a substitute for advice from a qualified medical professional.",
  },
  {
    q: "Do I need to give my email to read the free guide?",
    a: "No. You can download the 3-page foundations guide directly from the homepage with no signup. The contact form is for people who want updates when course enrollment opens.",
  },
  {
    q: "What is the refund policy?",
    a: "All course sales are final. Read the syllabus, browse the free 3-page guide, and ask any pre-purchase questions before you enroll.",
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
