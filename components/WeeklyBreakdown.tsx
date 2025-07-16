import React from 'react'

function WeeklyBreakdown() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">5-Week Transformation Journey</h2>
          <p className="text-xl text-gray-600">Each week builds on the previous, creating a complete health optimization system</p>
        </div>

        <div className="space-y-8">
          {[
            {
              week: 1,
              title: "Foundations of Fitness and Health Metrics",
              description: "Master the 4 essential health metrics and learn to read your body's dashboard",
              topics: ["Resting Heart Rate", "Daily Steps", "Sleep Quality", "Calories Burned"],
              color: "from-purple-500 to-fuchsia-500"
            },
            {
              week: 2,
              title: "Wearable Technology & Data Collection",
              description: "Set up accurate tracking systems and understand device capabilities",
              topics: ["Device Selection", "App Integration", "Accuracy Validation", "Data Sync"],
              color: "from-blue-500 to-indigo-500"
            },
            {
              week: 3,
              title: "Data Analytics Basics",
              description: "Identify patterns, trends, and actionable insights from your metrics",
              topics: ["Pattern Recognition", "Trend Analysis", "Correlation Discovery", "N-of-1 Trials"],
              color: "from-green-500 to-emerald-500"
            },
            {
              week: 4,
              title: "Intensity Minutes as Longevity Metric",
              description: "Master the most powerful predictor of healthy aging",
              topics: ["Moderate vs Vigorous", "SMART Goals", "Device Optimization", "Weekly Targets"],
              color: "from-orange-500 to-red-500"
            },
            {
              week: 5,
              title: "Long-Term Health Trends & Sustained Improvement",
              description: "Create your personal centenarian optimization protocol",
              topics: ["Trend Interpretation", "Protocol Development", "Habit Systems", "Community Building"],
              color: "from-violet-500 to-purple-500"
            }
          ].map((week, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 bg-gradient-to-br ${week.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
                    {week.week}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Week {week.week}: {week.title}</h3>
                  <p className="text-gray-600 mb-4">{week.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {week.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WeeklyBreakdown