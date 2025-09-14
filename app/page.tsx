"use client"

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import CourseOverview from '@/components/CourseOverview';
import WeeklyBreakdown from '@/components/WeeklyBreakdown';
import Specialization from '@/components/Specialization';
import Footer from '@/components/Footer';
import WaitlistForm from '@/components/WaitlistForm';
import ShareSection from '@/components/ShareSection';

const FitnessAnalyticsLanding = () => {

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    // A simple error message if the key is missing
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500 bg-red-100 p-4 rounded-lg">reCAPTCHA Site Key is not configured. Please check your environment variables.</p>
        </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Header />
            <Hero />
          </div>
        </div>
      </section>
      <CourseOverview />
      <WeeklyBreakdown />
      <Specialization /> 
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Lead Magnet Form Section */}
            <section id="join-waitlist">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
                <WaitlistForm pageSource="Fitness Analytics Landing Page" />
              </div>
            </section>
            <ShareSection />
          </div>
        </div>
        <Footer />
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default FitnessAnalyticsLanding;