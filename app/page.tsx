import { CourseOverview } from "@/components/CourseOverview";
import { EbookOffer } from "@/components/EbookOffer";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { Specialization } from "@/components/Specialization";
import { Testimonial } from "@/components/Testimonial";
import { WeeklyBreakdown } from "@/components/WeeklyBreakdown";

export default function HomePage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <>
      <main id="main" className="flex-1">
        <Hero />
        <CourseOverview />
        <WeeklyBreakdown />
        <Specialization />
        <Testimonial />
        <EbookOffer>
          <LeadForm recaptchaSiteKey={recaptchaSiteKey} />
        </EbookOffer>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
