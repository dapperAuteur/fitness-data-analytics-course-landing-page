import React, { useState } from 'react'
import { Share2, Mail, Facebook, Twitter, Linkedin, Copy, Download, Users, TrendingUp, Heart, Target } from 'lucide-react'

function ShareSection() {
  const [showShareModal, setShowShareModal] = useState(false)
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = "Get this free guide: Foundations of Fitness and Health Metrics - Learn to track your health like a pro!"
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
    <div>
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
    </div>
  )
}

export default ShareSection