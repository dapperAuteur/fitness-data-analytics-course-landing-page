import { BarChart3, Target, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Track the four numbers",
    body: "Learn the four foundational metrics that predict healthy aging: resting heart rate, daily steps, sleep quality, and weekly activity minutes.",
  },
  {
    icon: Target,
    title: "Hit the right dose",
    body: "Use device-guided feedback to land 150 moderate plus 75 vigorous activity minutes per week. That dose is linked to roughly 50% lower all-cause mortality in cohort studies.",
  },
  {
    icon: TrendingUp,
    title: "Build habits that hold",
    body: "Make changes that compound over decades, drawing on patterns seen in centenarian populations.",
  },
];

export function CourseOverview() {
  return (
    <section aria-labelledby="overview-heading" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="overview-heading" className="text-3xl font-bold sm:text-4xl">
            Read your data, train smarter
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Most people never learn what their wearable is actually telling them. By the end of this
            course you can read the four foundational metrics, spot weekly trends, and use both to
            decide what to do tomorrow.
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
