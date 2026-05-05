const weeks = [
  {
    week: 1,
    title: "Foundations of Fitness and Health Metrics",
    description: "Master the 4 essential health metrics and learn to read your body's dashboard.",
    topics: ["Resting Heart Rate", "Daily Steps", "Sleep Quality", "Activity Minutes"],
    tone: "from-cyan-500 to-sky-600",
  },
  {
    week: 2,
    title: "Wearable Technology & Data Collection",
    description: "Set up accurate tracking systems and understand device capabilities.",
    topics: ["Device Selection", "App Integration", "Accuracy Validation", "Data Sync"],
    tone: "from-sky-500 to-blue-600",
  },
  {
    week: 3,
    title: "Data Analytics Basics",
    description: "Identify patterns, trends, and actionable insights from your metrics.",
    topics: ["Pattern Recognition", "Trend Analysis", "Correlation Discovery", "N-of-1 Trials"],
    tone: "from-teal-500 to-cyan-600",
  },
  {
    week: 4,
    title: "Intensity Minutes as Longevity Metric",
    description: "Master the most powerful predictor of healthy aging.",
    topics: ["Moderate vs Vigorous", "SMART Goals", "Device Optimization", "Weekly Targets"],
    tone: "from-emerald-500 to-teal-600",
  },
  {
    week: 5,
    title: "Long-Term Health Trends & Sustained Improvement",
    description: "Create your personal centenarian optimization protocol.",
    topics: ["Trend Interpretation", "Protocol Development", "Habit Systems", "Community Building"],
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
