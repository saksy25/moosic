import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const moodOptions = [
    { label: 'Calm', emoji: '😊', color: 'bg-pink-300' },
    { label: 'Feel like Crying', emoji: '😢', color: 'bg-cyan-300' },
    { label: 'Frustrated', emoji: '😤', color: 'bg-orange-300' }
  ];

  const handleQuickMoodAnalysis = () => {
    navigate('/mood-analysis');
  };

  const handleFindCounsellors = () => {
    navigate('/counselling');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 border-2 border-purple-100">
            <h1 className="text-5xl font-black text-purple-600 mb-4">
              WELCOME TO MOOSIC!
            </h1>
            <h2 className="text-3xl font-bold text-pink-600 mb-6">
              HELLO, {user?.name?.toUpperCase()}! 🎵
            </h2>
            <p className="text-xl text-orange-500 font-bold">
              How are you feeling today?
            </p>
          </div>

          {/* Mood Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {moodOptions.map((mood, index) => (
              <div
                key={index}
                className={`${mood.color} rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200 border-2 border-white`}
                onClick={handleQuickMoodAnalysis}
              >
                <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">
                  {mood.label}
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-6xl">{mood.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100">
              <h3 className="text-2xl font-black text-purple-600 mb-4">Quick Mood Analysis</h3>
              <p className="text-gray-600 mb-4">Start analyzing your mood with various input methods</p>
              <button 
                onClick={handleQuickMoodAnalysis}
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
              >
                Start Analysis
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-100">
              <h3 className="text-2xl font-black text-pink-600 mb-4">Find Counsellors</h3>
              <p className="text-gray-600 mb-4">Connect with professional counsellors near you</p>
              <button 
                onClick={handleFindCounsellors}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
              >
                Find Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;