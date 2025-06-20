import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your existing components
import LandingPage from './components/landing';
import Signup from './components/signup';
import Login from './components/login';
import MoodAnalysis from './components/MoodAnalysis';
import Dashboard from './components/Dashboard';
import Counselling from './components/counselling';
import Therapy from './components/therapy';
import MoodHistory from './components/history';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/moosic" replace />} />
          <Route path="/moosic" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mood-analysis" 
            element={
              <ProtectedRoute>
                <MoodAnalysis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/therapy" 
            element={
              <ProtectedRoute>
                <Therapy />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/counselling" 
            element={
              <ProtectedRoute>
                <Counselling />
              </ProtectedRoute>
            } 
          /> 
          <Route 
            path="/mood-history" 
            element={
              <ProtectedRoute>
                <MoodHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to landing */}
          <Route path="*" element={<Navigate to="/moosic" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Component to redirect authenticated users away from login/signup pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default App;