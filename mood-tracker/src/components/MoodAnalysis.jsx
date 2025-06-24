import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';

const MoodAnalysis = () => {
//   const [selectedInput, setSelectedInput] = useState('Text');
//   const [moodText, setMoodText] = useState('');
//   const [selectedEmoji, setSelectedEmoji] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [analysis, setAnalysis] = useState('');
//   const fileInputRef = useRef(null);
//   const recordingInterval = useRef(null);
const {
    selectedInput,
    setSelectedInput,
    moodText,
    setMoodText,
    selectedEmoji,
    setSelectedEmoji,
    selectedImage,
    setSelectedImage,
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime,
    analysis,
    setAnalysis,
    moodAnalysis,
    setMoodAnalysis,
    recommendations,
    setRecommendations,
    fileInputRef,
    recordingInterval
  } = useAuth();
  const navigate = useNavigate();

  const inputTypes = [
    { name: 'Emoji' },
    { name: 'Text' },
    { name: 'Voice' },
    { name: 'Image' }
  ];

//   const moodEmojis = ['😊', '😢', '😡', '😴', '😍', '😰', '🤔', '😎', '🥳', '😔', '🤗', '😤'];
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
// Update the handleAnalyze function in your MoodAnalysis component
const handleAnalyze = async () => {
  let inputContent = '';
  
  if (selectedInput === 'Text' && moodText.trim()) {
    inputContent = moodText;
  } else if (selectedInput === 'Emoji' && selectedEmoji) {
    inputContent = selectedEmoji; // Just send the emoji itself
  } else {
    setAnalysis("Please provide input to analyze.");
    return;
  }

  try {
    setAnalysis("Analyzing your mood..."); // Loading state
    
    const res = await fetch('http://localhost:5000/api/analyze-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputType: selectedInput,
        content: inputContent,
      }),
    });
    console.log(inputContent);
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    if (data.analysis) {
      setAnalysis(data.analysis);
      setMoodAnalysis(data.analysis);
      // Get mood-based recommendations
      try {
        const recommendationsRes = await fetch('http://localhost:5000/api/mood-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis: data.analysis }),
        });

        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json();
          setRecommendations(recommendationsData.recommendations);
        }
      } catch (error) {
        console.error('Error getting recommendations:', error);
      }
    } else {
      setAnalysis("We received your input but couldn't generate an analysis. Please try again.");
    }
  } catch (err) {
    console.error('Analysis error:', err);
    setAnalysis("Something went wrong while analyzing your mood. Please try again later.");
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

  const renderInputContent = () => {
    switch (selectedInput) {
      case 'Emoji':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 font-medium drop-shadow-sm">Select an emoji indicating your mood:</p>
            <div className="grid grid-cols-6 gap-3">
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
          <textarea
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            placeholder="Type here how you feel today..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-md drop-shadow-sm"
          />
        );
      
      case 'Voice':
        return (
          <div className="space-y-4">
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
                  <p className="text-gray-600 font-medium drop-shadow-sm">Choose one image from your device</p>
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
    navigate('/therapy');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl">
          {/* Mood Input Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">Mood Input</h2>
            <p className="text-gray-600 mb-6">Share how you're feeling and get personalized insights and suggestions</p>
          
            {/* Input Type Buttons */}
            <div className="flex space-x-4 mb-6">
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
            <div className="mb-6">
              {renderInputContent()}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg drop-shadow-md transform hover:scale-105 active:scale-95"
            >
              Analyze
            </button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md drop-shadow-sm">
                <p className="text-gray-600 whitespace-pre-line drop-shadow-sm">{analysis}</p>
              </div>
            </div>
          )}
          {/* Tips Section */}
          <div className="mt-12 min-w-5xl bg-white mb-6 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Tips for Better Mood Tracking</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-3">
                <p><strong>Be Honest:</strong> Share your true feelings for accurate analysis</p>
                <p><strong>Be Specific:</strong> The more details you provide, the better insights you'll get</p>
              </div>
              <div className="space-y-3">
                <p><strong>Track Regularly:</strong> Daily mood tracking helps identify patterns</p>
                <p><strong>Take Action:</strong> Use the suggestions to improve your wellbeing</p>
              </div>
            </div>
          </div>

        {/* Therapy Button - Only show after analysis */}
            {analysis && analysis !== "Analyzing your mood..." && analysis !== "Please provide input to analyze." && (
            <div className="flex">
                <button
                onClick={handleTherapy}
                className="bg-cyan-400 text-white px-6 py-2 rounded-full font-semibold text-lg hover:bg-cyan-500 transition-colors shadow-lg drop-shadow-md transform hover:scale-105 active:scale-95"
                >
                Get Music Therapy and more...
                </button>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysis;