import React from 'react'
import {  Users, BookOpen, Star, Clock } from 'lucide-react';

function Header() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
        <Star className="w-4 h-4" />
        Part of the World's Fastest Centenarian Specialization
      </div>
      <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
        Foundations of Fitness and 
        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> Health Metrics</span>
      </h1>
      <p className="text-xl mb-8 text-purple-100">
        Learn to harness the power of personal metrics for better health decisions. 
        Transform your body's data into actionable insights for extraordinary longevity.
      </p>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
          <Clock className="w-5 h-5" />
          <span>5-Week Course</span>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
          <Users className="w-5 h-5" />
          <span>Collaborative Learning</span>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
          <BookOpen className="w-5 h-5" />
          <span>Open Science Approach</span>
        </div>
      </div>
    </div>
  )
}

export default Header