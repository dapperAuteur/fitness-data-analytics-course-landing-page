const weeks = [
  {
    week: 1,
    title: "Foundations of Health Metrics",
    description: "Read your body's dashboard: the four core numbers, and why your own baseline beats any average.",
    topics: ["Resting Heart Rate", "Daily Steps", "Sleep", "Activity Minutes", "Accuracy vs Precision"],
    tone: "from-cyan-500 to-sky-600",
  },
  {
    week: 2,
    title: "Wearable Tech and Data Collection",
    description: "Which numbers to trust and which to take with a grain of salt, plus a clean setup.",
    topics: ["Device Accuracy", "Why Calories Mislead", "Sleep Efficiency", "Choosing a Device"],
    tone: "from-sky-500 to-blue-600",
  },
  {
    week: 3,
    title: "Data Analytics Basics (Sleep Focus)",
    description: "Tell a real trend from daily noise, then run a simple sleep experiment.",
    topics: ["N-of-1 Trials", "Baseline and Normal Range", "Moving Averages", "Correlation vs Cause"],
    tone: "from-teal-500 to-cyan-600",
  },
  {
    week: 4,
    title: "N-of-1 Experiments with Intensity Minutes",
    description: "Run a controlled experiment on yourself using the activity that most predicts longevity.",
    topics: ["Intensity Zones", "Max Heart Rate", "Experiment Design", "Reading Your Result"],
    tone: "from-emerald-500 to-teal-600",
  },
  {
    week: 5,
    title: "Long-Term Trends and Sustainable Systems",
    description: "Read months not days, build systems that hold, and write your 90-day Health Blueprint.",
    topics: ["Reading Months of Data", "Systems Over Goals", "The Century Plan", "Capstone Blueprint"],
    tone: "from-blue-500 to-indigo-600",
  },
];

export function WeeklyBreakdown() {
  return (
    <section aria-labelledby="curriculum-heading" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="curriculum-heading" className="text-3xl font-bold sm:text-4xl">
            5-week transformation journey
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Each week builds on the previous, creating a complete health-optimization system.
          </p>
        </div>
        <ol className="mt-12 space-y-6">
          {weeks.map(({ week, title, description, topics, tone }) => (
            <li
              key={week}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-2xl font-bold text-white`}
                  aria-hidden="true"
                >
                  {week}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Week {week}: {title}
                  </h3>
                  <p className="mt-2 text-slate-600">{description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
