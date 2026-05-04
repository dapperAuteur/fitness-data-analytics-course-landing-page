import { CourseOverview } from "@/components/CourseOverview";
import { EbookOffer } from "@/components/EbookOffer";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Specialization } from "@/components/Specialization";
import { Testimonial } from "@/components/Testimonial";
import { WeeklyBreakdown } from "@/components/WeeklyBreakdown";

export default function HomePage() {
  return (
    <>
      <main id="main" className="flex-1">
        <Hero />
        <CourseOverview />
        <WeeklyBreakdown />
        <Specialization />
        <Testimonial />
        <EbookOffer>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            <p className="text-sm">
              Lead form lands here in Phase 5 (lead-capture + reCAPTCHA + server action).
            </p>
          </div>
        </EbookOffer>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
