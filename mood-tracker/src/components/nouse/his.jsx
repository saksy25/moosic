import React, { useState } from 'react';
import Navbar from '../Navbar';

const MoodHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');

  const periods = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: '1year', label: '1 Year' }
  ];

  const moodFilters = ['All', 'Happy', 'Sad', 'Anxious', 'Calm', 'Frustrated', 'Excited'];

  // Mock data - in a real app, this would come from your backend
  const moodHistory = [
    {
      id: 1,
      date: '2024-06-18',
      time: '09:30 AM',
      mood: 'Happy',
      emoji: '😊',
      rating: 8,
      notes: 'Had a great morning walk and felt energized',
      inputType: 'Text',
      color: 'bg-green-100 border-green-300'
    },
    {
      id: 2,
      date: '2024-06-17',
      time: '02:15 PM',
      mood: 'Anxious',
      emoji: '😰',
      rating: 4,
      notes: 'Feeling worried about upcoming presentation',
      inputType: 'Voice',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      id: 3,
      date: '2024-06-17',
      time: '08:45 AM',
      mood: 'Calm',
      emoji: '😌',
      rating: 7,
      notes: 'Meditation session helped start the day peacefully',
      inputType: 'Emoji',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 4,
      date: '2024-06-16',
      time: '07:20 PM',
      mood: 'Frustrated',
      emoji: '😤',
      rating: 3,
      notes: 'Long day at work with multiple deadlines',
      inputType: 'Text',
      color: 'bg-red-100 border-red-300'
    },
    {
      id: 5,
      date: '2024-06-16',
      time: '11:30 AM',
      mood: 'Excited',
      emoji: '🤩',
      rating: 9,
      notes: 'Got great news about job promotion!',
      inputType: 'Image',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 6,
      date: '2024-06-15',
      time: '06:45 PM',
      mood: 'Sad',
      emoji: '😢',
      rating: 2,
      notes: 'Missing family, feeling homesick',
      inputType: 'Voice',
      color: 'bg-gray-100 border-gray-300'
    }
  ];

  const filteredHistory = selectedMoodFilter === 'All' 
    ? moodHistory 
    : moodHistory.filter(entry => entry.mood === selectedMoodFilter);

  const getMoodStats = () => {
    const moodCounts = {};
    const totalEntries = filteredHistory.length;
    const totalRating = filteredHistory.reduce((sum, entry) => sum + entry.rating, 0);
    const averageRating = totalEntries > 0 ? (totalRating / totalEntries).toFixed(1) : 0;

    filteredHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'N/A'
    );

    return {
      totalEntries,
      averageRating,
      mostCommonMood,
      moodCounts
    };
  };

  const stats = getMoodStats();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
              Mood History
            </h1>
            <p className="text-gray-600 text-lg">
              Track your emotional journey and identify patterns over time
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Period Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Time Period</h3>
              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedPeriod === period.value
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter by Mood</h3>
              <div className="flex flex-wrap gap-2">
                {moodFilters.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMoodFilter(mood)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedMoodFilter === mood
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Entries</h4>
              <p className="text-3xl font-bold text-purple-600">{stats.totalEntries}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Average Rating</h4>
              <p className="text-3xl font-bold text-blue-600">{stats.averageRating}/10</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Most Common</h4>
              <p className="text-3xl font-bold text-green-600">{stats.mostCommonMood}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">This Week</h4>
              <p className="text-3xl font-bold text-orange-600">{filteredHistory.length}</p>
            </div>
          </div>
          </div>
          </div>
          </div>

  );
};

export default MoodHistory;