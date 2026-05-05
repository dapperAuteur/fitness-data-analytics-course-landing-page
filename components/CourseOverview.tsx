import { BarChart3, Target, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Track Like a Scientist",
    body: "Learn the 4 essential metrics that predict longevity: heart rate variability, intensity minutes, sleep quality, and daily movement patterns.",
  },
  {
    icon: Target,
    title: "Optimize with Precision",
    body: "Use device-guided feedback to achieve 150 moderate + 75 vigorous intensity minutes weekly — the research-proven formula for 50% mortality reduction.",
  },
  {
    icon: TrendingUp,
    title: "Build for Longevity",
    body: "Create sustainable habits that compound over decades, following patterns observed in centenarian populations worldwide.",
  },
];

export function CourseOverview() {
  return (
    <section aria-labelledby="overview-heading" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="overview-heading" className="text-3xl font-bold sm:text-4xl">
            Turn your health data into your longevity advantage
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Most people never learn to read their body&apos;s dashboard. By the end of this course, you&apos;ll
            know exactly how to interpret your health signals and use that information to make smart
            decisions every single day.
          </p>
        </div>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, body }) => (
            <li key={title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600">
                <Icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
