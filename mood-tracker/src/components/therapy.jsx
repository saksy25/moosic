import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import your existing Navbar component

const MoosicTherapyPage = () => {
  const [activeTab, setActiveTab] = useState('Playlist');
  const navigate = useNavigate();
  const therapyTabs = ['Music', 'Playlist', 'Video', 'Book'];

  const playlistItems = [
    { song: 'Calm Waters', artist: 'Peaceful Sounds', id: 1, link: 'https://example.com/calm-waters' },
    { song: 'Mindful Moments', artist: 'Zen Masters', id: 2, link: 'https://example.com/mindful-moments' },
    { song: 'Healing Frequencies', artist: 'Therapeutic Tones', id: 3, link: 'https://example.com/healing-frequencies' },
    { song: 'Serenity Now', artist: 'Meditation Music', id: 4, link: 'https://example.com/serenity-now' }
  ];

  const musicItems = [
    { title: 'Relaxation Sounds', artist: 'Nature Sounds', id: 1 },
    { title: 'Anxiety Relief', artist: 'Therapeutic Music', id: 2 },
    { title: 'Sleep Meditation', artist: 'Dream Sounds', id: 3 },
    { title: 'Focus Music', artist: 'Concentration Aid', id: 4 }
  ];

  const videoItems = [
    { title: 'Guided Meditation for Beginners', duration: '15 min', id: 1 },
    { title: 'Breathing Exercises for Anxiety', duration: '10 min', id: 2 },
    { title: 'Progressive Muscle Relaxation', duration: '20 min', id: 3 },
    { title: 'Mindfulness Practice', duration: '12 min', id: 4 }
  ];

  const bookItems = [
    { title: 'The Anxiety and Worry Workbook', author: 'David A. Clark', id: 1 },
    { title: 'Mindfulness for Beginners', author: 'Jon Kabat-Zinn', id: 2 },
    { title: 'The Happiness Project', author: 'Gretchen Rubin', id: 3 },
    { title: 'Emotional Intelligence', author: 'Daniel Goleman', id: 4 }
  ];

  const handleBackToMoodAnalysis = () => {
    navigate('/mood-analysis'); // or whatever your mood analysis route is
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Playlist':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapeutic Playlists</h3>
            {playlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{item.song}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-600">{item.artist}</span>
                </div>
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Listen Now
                </a>
              </div>
            ))}
          </div>
        );

      case 'Music':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapeutic Music</h3>
            <p className="text-gray-600 mb-6">Discover music specifically designed to support your mental wellbeing.</p>
            {musicItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{item.title}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-600">{item.artist}</span>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-medium">
                  Play
                </button>
              </div>
            ))}
          </div>
        );

      case 'Video':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapy Videos</h3>
            <p className="text-gray-600 mb-6">Watch guided therapy sessions and mindfulness videos.</p>
            {videoItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{item.title}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-600">{item.duration}</span>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-medium">
                  Watch
                </button>
              </div>
            ))}
          </div>
        );

      case 'Book':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Recommendations</h3>
            <p className="text-gray-600 mb-6">Explore books and resources for mental health and wellbeing.</p>
            {bookItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{item.title}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-600">{item.author}</span>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">Professional Support</h2>
              <p className="text-gray-600">Explore therapeutic resources tailored to your needs</p>
            </div>
            <button
              onClick={handleBackToMoodAnalysis}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
            >
              ← Back to Mood Analysis
            </button>
          </div>

          {/* Therapy Tabs */}
          <div className="flex space-x-4 mb-8">
            {therapyTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md drop-shadow-sm ${
                  activeTab === tab
                    ? 'bg-cyan-400 text-white shadow-lg transform scale-105'
                    : 'bg-gray-400 text-white hover:bg-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            {renderTabContent()}
          </div>

          {/* Emergency Support Section */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-800 mb-2">Need Immediate Help?</h4>
            <p className="text-red-700 mb-4">If you're experiencing a mental health crisis, please reach out for immediate support:</p>
            <div className="space-y-2 text-sm">
              <p className="text-red-700">• Emergency: 911</p>
              <p className="text-red-700">• Crisis Text Line: Text HOME to 741741</p>
              <p className="text-red-700">• National Suicide Prevention Lifeline: 988</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoosicTherapyPage;