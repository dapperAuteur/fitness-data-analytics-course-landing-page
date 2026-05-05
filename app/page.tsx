import { CourseOverview } from "@/components/CourseOverview";
import { EbookOffer } from "@/components/EbookOffer";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { Specialization } from "@/components/Specialization";
import { Testimonial } from "@/components/Testimonial";
import { WeeklyBreakdown } from "@/components/WeeklyBreakdown";

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Foundations of Fitness and Health Metrics",
  description:
    "A 5-week course teaching coaches, trainers, and data-curious athletes how to turn their fitness-tracker data into actionable training decisions.",
  provider: {
    "@type": "Organization",
    name: "B4C LLC",
    sameAs: "https://fdac.witus.online",
  },
  educationalLevel: "Adult",
  inLanguage: "en",
  url: "https://fdac.witus.online",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: "PT5H",
  },
  offers: {
    "@type": "Offer",
    category: "Course",
    availability: "https://schema.org/PreOrder",
  },
} as const;

export default function HomePage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
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
