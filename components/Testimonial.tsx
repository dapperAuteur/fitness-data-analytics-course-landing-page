export function Testimonial() {
  return (
    <section
      aria-labelledby="testimonial-heading"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="testimonial-heading" className="text-3xl font-bold sm:text-4xl">
          From the field
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Stories from coaches, trainers, and athletes who learned to read their data.
        </p>
        <figure className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-left">
          <blockquote className="text-lg text-slate-700">
            <em>Testimonial slot. Content lands here in week 2 of the launch window.</em>
          </blockquote>
          <figcaption className="mt-4 text-sm text-slate-600">
            Real quote + role + photo replace this placeholder before public promotion.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
