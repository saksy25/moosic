import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';

const MoosicTherapyPage = () => {
  const [activeTab, setActiveTab] = useState('Music');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recommendations } = useAuth();
  
  const therapyTabs = ['Music', 'Playlist', 'Video', 'Book'];

  const handleBackToMoodAnalysis = () => {
    navigate('/mood-analysis');
  };

  const renderTabContent = () => {
    if (!recommendations) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No recommendations available. Please analyze your mood first.</p>
          <button
            onClick={handleBackToMoodAnalysis}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Mood Analysis
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'Music':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapeutic Music</h3>
            <p className="text-gray-600 mb-6">Music specifically selected based on your current mood.</p>
            {recommendations.songs && recommendations.songs.length > 0 ? (
              recommendations.songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  {song.image && (
                    <img 
                      src={song.image} 
                      alt={song.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium">{song.title}</h4>
                    <p className="text-gray-600">{song.artist}</p>
                  </div>
                  <div className="flex space-x-2">
                    {song.preview_url && (
                      <button
                        onClick={() => window.open(song.preview_url, '_blank')}
                        className="text-green-500 hover:text-green-700 font-medium px-3 py-1 border border-green-500 rounded"
                      >
                        Preview
                      </button>
                    )}
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 font-medium px-3 py-1 border border-blue-500 rounded"
                    >
                      Open in Spotify
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No music recommendations available at the moment.</p>
            )}
          </div>
        );

      case 'Playlist':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapeutic Playlists</h3>
            <p className="text-gray-600 mb-6">Curated playlists to support your current emotional state.</p>
            {recommendations.playlists && recommendations.playlists.length > 0 ? (
              recommendations.playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  {playlist.image && (
                    <img 
                      src={playlist.image} 
                      alt={playlist.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium">{playlist.title}</h4>
                    <p className="text-gray-600 text-sm">{playlist.description}</p>
                    <p className="text-gray-500 text-xs">{playlist.tracks} tracks</p>
                  </div>
                  <a
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium px-3 py-1 border border-blue-500 rounded"
                  >
                    Open in Spotify
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No playlist recommendations available at the moment.</p>
            )}
          </div>
        );

      case 'Video':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Therapy Videos</h3>
            <p className="text-gray-600 mb-6">Helpful videos tailored to your current emotional needs.</p>
            {recommendations.videos && recommendations.videos.length > 0 ? (
              recommendations.videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-24 h-18 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium line-clamp-2">{video.title}</h4>
                    <p className="text-gray-600 text-sm">{video.channel}</p>
                    <p className="text-gray-500 text-xs line-clamp-2">{video.description}</p>
                  </div>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium px-3 py-1 border border-blue-500 rounded"
                  >
                    Watch
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No video recommendations available at the moment.</p>
            )}
          </div>
        );

      case 'Book':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Recommendations</h3>
            <p className="text-gray-600 mb-6">Books and resources selected based on your emotional needs.</p>
            {recommendations.books && recommendations.books.length > 0 ? (
              recommendations.books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  {book.thumbnail && (
                    <img 
                      src={book.thumbnail} 
                      alt={book.title}
                      className="w-16 h-20 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium">{book.title}</h4>
                    <p className="text-gray-600">{book.authors}</p>
                    <p className="text-gray-500 text-sm line-clamp-3">{book.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    {book.previewLink && (
                      <a
                        href={book.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700 font-medium px-3 py-1 border border-green-500 rounded text-sm"
                      >
                        Preview
                      </a>
                    )}
                    <a
                      href={book.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 font-medium px-3 py-1 border border-blue-500 rounded text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No book recommendations available at the moment.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">Professional Support</h2>
              <p className="text-gray-600">Personalized therapeutic resources based on your mood analysis</p>
            </div>
            <button
              onClick={handleBackToMoodAnalysis}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
            >
              ← Back to Mood Analysis
            </button>
          </div>

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

          <div className="bg-white rounded-xl p-6 shadow-md">
            {renderTabContent()}
          </div>

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