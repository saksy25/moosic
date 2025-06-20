import React, { useState, useRef } from 'react';
import Navbar from './Navbar';

const MoodAnalysis = () => {
  const [selectedInput, setSelectedInput] = useState('Text');
  const [moodText, setMoodText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodResult, setMoodResult] = useState(null);
  const fileInputRef = useRef(null);
  const recordingInterval = useRef(null);

  const inputTypes = [
    { name: 'Emoji' },
    { name: 'Text' },
    { name: 'Voice' },
    { name: 'Image' }
  ];

  const moodEmojis = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😍', label: 'In Love' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '🤔', label: 'Thoughtful' },
    { emoji: '😎', label: 'Confident' },
    { emoji: '🥳', label: 'Excited' },
    { emoji: '😔', label: 'Disappointed' },
    { emoji: '🤗', label: 'Affectionate' },
    { emoji: '😤', label: 'Frustrated' }
  ];

  const handleAnalyze = async () => {
    let inputContent = '';
    
    if (selectedInput === 'Text' && moodText.trim()) {
      inputContent = moodText;
    } else if (selectedInput === 'Emoji' && selectedEmoji) {
      inputContent = `Selected mood: ${selectedEmoji}`;
    } else if (selectedInput === 'Image' && selectedImage) {
      inputContent = 'Image uploaded for mood analysis';
    } else if (selectedInput === 'Voice' && recordingTime > 0) {
      inputContent = `Voice recording (${recordingTime}s) for mood analysis`;
    }
    
    if (!inputContent) {
      setAnalysis("Please provide input to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');
    setMoodResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: selectedInput,
          content: inputContent,
          userId: localStorage.getItem('userId') // Add user ID if available
        }),
      });

      const data = await response.json();
      
      if (data.analysis) {
        setMoodResult(data);
        setAnalysis(data.analysis);
      } else {
        setAnalysis("Sorry, we couldn't analyze your mood. Please try again.");
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysis("Something went wrong while analyzing mood. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      clearInterval(recordingInterval.current);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'text-green-600 bg-green-50 border-green-200',
      sad: 'text-blue-600 bg-blue-50 border-blue-200',
      angry: 'text-red-600 bg-red-50 border-red-200',
      anxious: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      tired: 'text-gray-600 bg-gray-50 border-gray-200',
      love: 'text-pink-600 bg-pink-50 border-pink-200',
      confident: 'text-purple-600 bg-purple-50 border-purple-200',
      excited: 'text-orange-600 bg-orange-50 border-orange-200',
      neutral: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[mood] || colors.neutral;
  };

  const renderInputContent = () => {
    switch (selectedInput) {
      case 'Emoji':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 font-medium drop-shadow-sm">Select an emoji that represents how you feel right now:</p>
            <div className="grid grid-cols-4 gap-3">
              {moodEmojis.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEmoji(item.emoji)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 shadow-md drop-shadow-sm ${
                    selectedEmoji === item.emoji
                      ? 'bg-blue-100 ring-2 ring-blue-400 transform scale-105'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-2">{item.emoji}</span>
                  <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            {selectedEmoji && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                <p className="text-blue-800 font-medium drop-shadow-sm">
                  Selected mood: <span className="text-2xl">{selectedEmoji}</span>
                </p>
              </div>
            )}
          </div>
        );
      
      case 'Text':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 font-medium drop-shadow-sm">Tell us how you're feeling today:</p>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="I'm feeling... (e.g., 'I had a really tough day at work and I'm feeling overwhelmed' or 'I'm excited about my upcoming vacation!')"
              className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-md drop-shadow-sm"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500">
              {moodText.length}/500 characters
            </div>
          </div>
        );
      
      case 'Voice':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 font-medium drop-shadow-sm">Record a voice message about your mood:</p>
            <div className="flex items-center justify-center">
              <button
                onClick={handleVoiceRecord}
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 shadow-lg drop-shadow-md ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {isRecording && (
              <div className="flex items-center justify-center space-x-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-red-500 rounded-full animate-pulse`}
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-red-500 font-mono font-bold drop-shadow-sm">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            {recordingTime > 0 && !isRecording && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                <p className="text-blue-800 font-medium drop-shadow-sm">
                  Voice recording completed: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
            )}
          </div>
        );
      
      case 'Image':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 font-medium drop-shadow-sm">Upload an image that represents your current mood:</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center shadow-md drop-shadow-sm">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-xl flex items-center justify-center shadow-md">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected mood"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <p className="text-gray-600 font-medium drop-shadow-sm">
                    Selected: {selectedImage.name}
                  </p>
                  <button
                    onClick={handleImageClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md drop-shadow-sm"
                  >
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium drop-shadow-sm">Choose an image from your device</p>
                  <button
                    onClick={handleImageClick}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md drop-shadow-sm"
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleTherapy = () => {
    console.log('Therapy session initiated');
    // You can navigate to a therapy page or open a modal here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 drop-shadow-sm">Mood Analysis</h1>
            <p className="text-gray-600">Share how you're feeling and get personalized insights and suggestions</p>
          </div>

          {/* Mood Input Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 drop-shadow-sm">How are you feeling today?</h2>
            
            {/* Input Type Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {inputTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedInput(type.name)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md drop-shadow-sm ${
                    selectedInput === type.name
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-400 text-white hover:bg-gray-500'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Dynamic Input Content */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
              {renderInputContent()}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`bg-green-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg drop-shadow-md transform hover:scale-105 active:scale-95 ${
                isAnalyzing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-green-600'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze My Mood'
              )}
            </button>
          </div>

          {/* Analysis Results */}
          {moodResult && (
            <div className="mb-8 space-y-4">
              {/* Mood Detection Card */}
              <div className={`p-6 rounded-xl border shadow-md ${getMoodColor(moodResult.detectedMood)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Detected Mood</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold capitalize">{moodResult.detectedMood}</span>
                    <div className="w-3 h-3 rounded-full bg-current opacity-60"></div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mood Intensity</span>
                    <span>{moodResult.moodScore}/10</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(moodResult.moodScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Analysis Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Mood Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {moodResult.analysis}
                </p>
              </div>

              {/* Suggestion Card */}
              {moodResult.suggestion && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-md">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Personalized Suggestion
                  </h3>
                  <p className="text-blue-700 leading-relaxed font-medium">
                    {moodResult.suggestion}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => {
                    setMoodResult(null);
                    setAnalysis('');
                    setMoodText('');
                    setSelectedEmoji('');
                    setSelectedImage(null);
                    setRecordingTime(0);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  New Analysis
                </button>
                <button
                  onClick={handleTherapy}
                  className="bg-cyan-400 text-white px-6 py-2 rounded-lg hover:bg-cyan-500 transition-colors shadow-md"
                >
                  Get Support
                </button>
              </div>
            </div>
          )}

          {/* Legacy Analysis Display (for backward compatibility) */}
          {analysis && !moodResult && (
            <div className="mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Analysis Result</h3>
                <p className="text-gray-600 whitespace-pre-line">{analysis}</p>
              </div>
            </div>
          )}

          {/* Therapy Button - Only show if no current analysis */}
          {!moodResult && !analysis && (
            <div className="flex justify-center">
              <button
                onClick={handleTherapy}
                className="bg-cyan-400 text-white px-12 py-4 rounded-full font-semibold text-lg hover:bg-cyan-500 transition-colors shadow-lg drop-shadow-md transform hover:scale-105 active:scale-95"
              >
                Get Professional Support
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Tips for Better Mood Tracking</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <p><strong>Be Honest:</strong> Share your true feelings for accurate analysis</p>
                <p><strong>Be Specific:</strong> The more details you provide, the better insights you'll get</p>
              </div>
              <div className="space-y-2">
                <p><strong>Track Regularly:</strong> Daily mood tracking helps identify patterns</p>
                <p><strong>Take Action:</strong> Use the suggestions to improve your wellbeing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysis;