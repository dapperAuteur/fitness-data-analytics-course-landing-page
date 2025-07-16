import React from 'react'
import {  BarChart3, TrendingUp, Target } from 'lucide-react';

function CourseOverview() {
  return (
    <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Turn Your Health Data Into Your Longevity Advantage
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Most people never learn to read their body's dashboard. By the end of this course, 
                you'll know exactly how to interpret your health signals and use that information 
                to make smart decisions every single day.
              </p>
            </div>
    
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Like a Scientist</h3>
                <p className="text-gray-600">
                  Learn the 4 essential metrics that predict longevity: heart rate variability, 
                  intensity minutes, sleep quality, and daily movement patterns.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Optimize with Precision</h3>
                <p className="text-gray-600">
                  Use device-guided feedback to achieve 150 moderate + 75 vigorous intensity 
                  minutes weekly - the research-proven formula for 50% mortality reduction.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Build for Longevity</h3>
                <p className="text-gray-600">
                  Create sustainable habits that compound over decades, following patterns 
                  observed in centenarian populations worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>
  )
}

export default CourseOverview