'use client'

import { useState } from 'react'
import { Share2, Mail, Facebook, Twitter, Linkedin, Copy, Download, Users, TrendingUp, Heart, Target } from 'lucide-react'
import { WaitlistForm } from '@/components/WaitlistForm'
import Footer from '@/components/Footer'

export default function EbookLandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = "Get this free guide: Foundations of Fitness and Health Metrics - Learn to track your health like a pro!"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In real implementation, send to your email service
    console.log('Email submitted:', email)
    setIsSubmitted(true)
    
    // Simulate ebook delivery
    setTimeout(() => {
      // In real app, this would trigger ebook download
      alert('Check your email for the ebook download link!')
    }, 1000)
  }

  const shareVia = (platform: string) => {
    const urls = {
      email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this free health tracking guide: ${pageUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl)
      alert('Link copied to clipboard!')
      return
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
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
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Your Free Guide</h3>
                    <p className="text-gray-600">Enter your email and get instant access to the 3-page quick start guide.</p>
                  </div>

                  {/* <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                    >
                      Download Free Guide Now
                    </button>
                  </form> */}
                  <WaitlistForm />

                  <p className="text-xs text-gray-500 text-center mt-4">
                    No spam. Unsubscribe anytime. Part of the World's Fastest Centenarian Specialization.
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email!</h3>
                  <p className="text-gray-600 mb-6">Your free guide is on its way. Check your inbox for the download link.</p>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Share This Guide
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center text-white mb-12">
            <p className="text-lg mb-4">By Brand Anthony McDonald</p>
            <p className="text-sm opacity-90 max-w-2xl mx-auto">
              Part of the "World's Fastest Centenarian" specialization program. 
              This preview guide introduces you to health tracking basics before the full video course experience.
            </p>
          </div>

          {/* Share Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Help Others Get Healthier</h2>
            <p className="text-lg mb-6">
              Know someone who could benefit from tracking their health? Share this free guide with them!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => shareVia('email')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              
              <button
                onClick={() => shareVia('facebook')}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              
              <button
                onClick={() => shareVia('twitter')}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              
              <button
                onClick={() => shareVia('linkedin')}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              
              <button
                onClick={() => shareVia('copy')}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Share This Guide</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Help others discover this free health tracking guide!
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => shareVia('email')}
                className="flex items-center gap-2 justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              
              <button
                onClick={() => shareVia('facebook')}
                className="flex items-center gap-2 justify-center bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              
              <button
                onClick={() => shareVia('twitter')}
                className="flex items-center gap-2 justify-center bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              
              <button
                onClick={() => shareVia('copy')}
                className="flex items-center gap-2 justify-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  )
}