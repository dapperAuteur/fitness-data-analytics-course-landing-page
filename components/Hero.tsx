import React from 'react'
import { Heart, Activity, Target, Zap } from 'lucide-react';

function Hero() {
  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white">
            <Heart className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold">72 BPM</div>
            <div className="text-sm opacity-90">Resting Heart Rate</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white">
            <Activity className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold">8,547</div>
            <div className="text-sm opacity-90">Daily Steps</div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl p-6 text-white">
            <Target className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold">150/75</div>
            <div className="text-sm opacity-90">Intensity Minutes</div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white">
            <Zap className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold">87%</div>
            <div className="text-sm opacity-90">Sleep Quality</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero