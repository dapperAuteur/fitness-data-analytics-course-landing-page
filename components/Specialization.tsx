import { BarChart3, Target, Users } from "lucide-react";

const courses = [
  {
    icon: BarChart3,
    title: "Course 1: Foundations",
    body: "Master health metrics and data-driven decision making.",
    badge: "Current course",
    tone: "border-cyan-200 bg-cyan-50",
    iconTone: "from-cyan-500 to-sky-600",
    badgeTone: "bg-cyan-100 text-cyan-800",
  },
  {
    icon: Target,
    title: "Course 2: Intervention Design",
    body: "Turn data into action with scientific intervention protocols.",
    bullets: ["8-week intensive program", "Personal experimentation framework", "From tracker to health designer"],
    tone: "border-blue-200 bg-blue-50",
    iconTone: "from-blue-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "Course 3: Open Science",
    body: "Collaborative data collection and protocol experiments.",
    bullets: ["Citizen science methodology", "Community data insights", "Peer-reviewed protocols"],
    tone: "border-teal-200 bg-teal-50",
    iconTone: "from-teal-500 to-emerald-600",
  },
];

export function Specialization() {
  return (
    <section aria-labelledby="specialization-heading" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="specialization-heading" className="text-3xl font-bold sm:text-4xl">
            Part of the complete specialization
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            This foundational course connects to advanced programs for comprehensive health
            optimization.
          </p>
        </div>
        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {courses.map(({ icon: Icon, title, body, badge, bullets, tone, iconTone, badgeTone }) => (
            <li key={title} className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconTone}`}
              >
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold sm:text-2xl">{title}</h3>
              <p className="mt-3 text-slate-700">{body}</p>
              {badge && (
                <p className={`mt-4 inline-block rounded-full px-3 py-1 text-sm ${badgeTone ?? ""}`}>
                  {badge}
                </p>
              )}
              {bullets && (
                <ul className="mt-4 space-y-1 text-sm text-slate-600">
                  {bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
