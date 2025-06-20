import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';

const MoosicMoodHistoryPage = () => {
  const [selectedSidebar, setSelectedSidebar] = useState('Mood History');
  const [viewType, setViewType] = useState('Weekly');
  const [showWellnessReport, setShowWellnessReport] = useState(false);

  const sidebarItems = [
    { name: 'Mood Analysis', icon: '📊', active: false },
    { name: 'Counselling', icon: '💬', active: false },
    { name: 'Mood History', icon: '📈', active: true }
  ];

  // Sample mood data for the chart
  const weeklyData = [
    { day: '1', mood: 300 },
    { day: '3', mood: 310 },
    { day: '5', mood: 320 },
    { day: '7', mood: 210 },
    { day: '9', mood: 350 },
    { day: '11', mood: 310 },
    { day: '13', mood: 160 },
    { day: '15', mood: 240 }
  ];

  const dailyData = [
    { day: '1', mood: 280 },
    { day: '2', mood: 320 },
    { day: '3', mood: 310 },
    { day: '4', mood: 290 },
    { day: '5', mood: 340 },
    { day: '6', mood: 220 },
    { day: '7', mood: 200 },
    { day: '8', mood: 310 },
    { day: '9', mood: 350 },
    { day: '10', mood: 330 },
    { day: '11', mood: 310 },
    { day: '12', mood: 280 },
    { day: '13', mood: 160 },
    { day: '14', mood: 190 },
    { day: '15', mood: 240 }
  ];

  const currentData = viewType === 'Weekly' ? weeklyData : dailyData;

  const generateWellnessReport = () => {
    const avgMood = currentData.reduce((sum, item) => sum + item.mood, 0) / currentData.length;
    const minMood = Math.min(...currentData.map(item => item.mood));
    const maxMood = Math.max(...currentData.map(item => item.mood));
    const moodRange = maxMood - minMood;
    
    let summary = '';
    let recommendations = [];

    if (avgMood >= 300) {
      summary = 'Your overall mood has been positive with good stability. You\'re maintaining a healthy emotional balance.';
      recommendations = [
        'Continue your current wellness practices',
        'Regular exercise and social connections are beneficial',
        'Consider mindfulness meditation to maintain stability'
      ];
    } else if (avgMood >= 200) {
      summary = 'Your mood shows moderate levels with some fluctuations. There are opportunities for improvement.';
      recommendations = [
        'Focus on stress management techniques',
        'Consider talking to a counselor for support',
        'Try engaging in activities that bring you joy'
      ];
    } else {
      summary = 'Your mood levels indicate you may be experiencing some challenges. It\'s important to seek support.';
      recommendations = [
        'Please consider speaking with a mental health professional',
        'Reach out to friends and family for support',
        'Focus on basic self-care: sleep, nutrition, and gentle exercise'
      ];
    }

    return {
      summary,
      recommendations,
      avgMood: Math.round(avgMood),
      minMood,
      maxMood,
      moodRange,
      period: viewType.toLowerCase()
    };
  };

  const wellnessReport = generateWellnessReport();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-sm">Your Mood History</h2>
        {/* Content Area */}
        <div className="px-8">
          {/* Chart Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* Chart Controls */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setViewType('Weekly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewType === 'Weekly'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewType('Daily')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewType === 'Daily'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Daily
              </button>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 700]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#333" 
                    strokeWidth={2}
                    dot={{ fill: '#333', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#333' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Summarization of the graph</h3>
              <button
                onClick={() => setShowWellnessReport(!showWellnessReport)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showWellnessReport ? 'Hide Report' : 'wellness report'}
              </button>
            </div>

            {showWellnessReport && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Mood Summary ({viewType})</h4>
                  <p className="text-blue-700 text-sm">{wellnessReport.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-green-800 mb-1">Average Mood</h5>
                    <p className="text-2xl font-bold text-green-600">{wellnessReport.avgMood}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h5 className="font-semibold text-orange-800 mb-1">Mood Range</h5>
                    <p className="text-2xl font-bold text-orange-600">{wellnessReport.moodRange}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-800 mb-1">Highest Mood</h5>
                    <p className="text-2xl font-bold text-purple-600">{wellnessReport.maxMood}</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {wellnessReport.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-gray-700 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Quick Tip</h4>
                  <p className="text-yellow-700 text-sm">
                    Tracking your mood daily helps identify patterns and triggers. Consider noting what activities or events correlate with your mood changes.
                  </p>
                </div>
              </div>
            )}

            {!showWellnessReport && (
              <p className="text-gray-600">
                Click "wellness report" to view detailed analysis of your mood patterns, insights, and personalized recommendations for mental well-being.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoosicMoodHistoryPage;