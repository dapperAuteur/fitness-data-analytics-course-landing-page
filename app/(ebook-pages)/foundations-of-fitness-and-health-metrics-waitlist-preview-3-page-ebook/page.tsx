'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { Download, Users, TrendingUp, Heart, Target } from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'
import Footer from '@/components/Footer'
import ShareSection from '@/components/ShareSection'

export default function EbookLandingPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 bg-red-100 p-4 rounded-lg">
          reCAPTCHA Site Key is not configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center text-white mb-12">
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-medium">FREE 3-Page Quick Start Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Foundations of Fitness and Health Metrics
            </h1>
            
            <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto">
              Your Complete Guide to Getting Started with Health Data
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              {[
                { icon: '❤️', label: 'Heart Rate' },
                { icon: '👟', label: 'Daily Steps' },
                { icon: '😴', label: 'Sleep Hours' },
                { icon: '⚡', label: 'Energy Level' }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl mb-2 border border-white/20">
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              {/* Left Column - Benefits */}
              <div className="text-white space-y-6">
                <h2 className="text-3xl font-bold mb-6">What You'll Learn</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: <Target className="w-5 h-5" />, text: "The 4 key health numbers that matter most" },
                    { icon: <TrendingUp className="w-5 h-5" />, text: "Simple tools that work (most are free)" },
                    { icon: <Heart className="w-5 h-5" />, text: "How to read your body's daily signals" },
                    { icon: <Users className="w-5 h-5" />, text: "Make smart health choices based on your data" }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-yellow-300">{benefit.icon}</div>
                      <span className="font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <p className="text-lg mb-2"><strong>Clear, everyday language. No medical background needed</strong></p>
                  <p className="text-sm opacity-90">Perfect for health coaches, fitness professionals, wellness enthusiasts, and anyone wanting to understand their health data better.</p>
                </div>
              </div>

              {/* Right Column - Email Capture */}
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
  
                    <div className="text-center mb-6">
                      <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Your Free Guide</h3>
                      <p className="text-gray-600">Enter your email and get instant access to the 3-page quick start guide.</p>
                    </div>
                    <WaitlistForm pageSource='Fitness Analytics 3 Page eBook Landing Page' />

                    <p className="text-xs text-gray-500 text-center mt-4">
                      No spam. Unsubscribe anytime. Part of the World's Fastest Centenarian Specialization.
                    </p>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email!</h3>
                    <p className="text-gray-600 mb-6">Your free guide is on its way. Check your inbox for the download link.</p>
                  </div>
              </div>
            </div>

            {/* Social Proof */}
            {/* Share Section */}
            <ShareSection />
          </div>
        </div>
        <Footer/>
      </div>
    </GoogleReCaptchaProvider>
  )
}