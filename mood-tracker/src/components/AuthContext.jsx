import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [selectedInput, setSelectedInput] = useState('Text');
  const [moodText, setMoodText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState('');
  const fileInputRef = useRef(null);
  const recordingInterval = useRef(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Optionally verify token with server
      verifyToken(storedToken);
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // const value = {
  //   user,
  //   token,
  //   loading,
  //   login,
  //   logout,
  //   isAuthenticated
  // };
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
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
    fileInputRef,
    recordingInterval
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};