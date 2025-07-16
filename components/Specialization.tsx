import React from 'react'
import { BarChart3, Users, Target } from 'lucide-react';

function Specialization() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Part of the Complete Specialization</h2>
          <p className="text-xl text-gray-600">This foundational course connects to advanced programs for comprehensive health optimization</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-8 border border-purple-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course 1: Foundations</h3>
            <p className="text-gray-600 mb-4">Master health metrics and data-driven decision making</p>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm inline-block">
              Current Course
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course 2: Intervention Design</h3>
            <p className="text-gray-600 mb-4">Turn data into action with scientific intervention protocols</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 8-week intensive program</li>
              <li>• Personal experimentation framework</li>
              <li>• From tracker to health designer</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course 3: Open Science</h3>
            <p className="text-gray-600 mb-4">Collaborative data collection and protocol experiments</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Citizen science methodology</li>
              <li>• Community data insights</li>
              <li>• Peer-reviewed protocols</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Specialization