import React from 'react'
import { Check } from 'lucide-react';
import ShareButtons from './ShareButtons';

function ThankYouPage() {

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
      <p className="text-xl text-gray-600 mb-6">You're on the waitlist! We'll notify you when enrollment opens.</p>
      <p className="text-gray-600 mb-8">In the meantime, share this opportunity with others!</p>
      <ShareButtons />
  </div>
  )
}

export default ThankYouPage