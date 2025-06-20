import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../assets/char2.jpg';

export default function MoosicLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess('Login successful!');
        
        // Redirect to dashboard or home page after short delay
        setTimeout(() => {
          navigate('/dashboard'); // Change this to your desired route
        }, 1500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full px-8 max-w-md mb-8">
        <h1 className="text-6xl font-black pb-6 border-b-2 border-gray-400 text-purple-600 text-center drop-shadow-lg">
          MOOSIC
        </h1>
      </div>

      {/* Login Card */}
      <div className="bg-cream bg-opacity-90 border-cream1 rounded-3xl p-8 w-full max-w-md shadow-cream1 shadow-2xl">
        <img className="object-contain -mt-2 mb-4" src={img} alt="Character" />

        {/* Sign In Title */}
        <h2 className="text-4xl font-black text-orange-500 text-center mb-8 drop-shadow-md">
          SIGN IN
        </h2>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full px-6 py-4 bg-white rounded-full border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-pink-600 font-bold placeholder-pink-400 shadow-lg drop-shadow-sm"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-6 py-4 bg-white rounded-full border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-pink-600 font-bold placeholder-pink-400 shadow-lg drop-shadow-sm"
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-black text-xl rounded-full shadow-xl drop-shadow-lg transform transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-400 hover:bg-purple-500 hover:scale-105 active:scale-95'
              } text-white`}
            >
              {loading ? 'SIGNING IN...' : 'LOG IN'}
            </button>
          </div>
        </form>

        {/* SignUp Link */}
        <div className="text-center mt-6">
          <span className="text-pink-600 font-bold drop-shadow-sm">Don't have an account? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-orange-500 font-black hover:text-orange-600 transition-colors drop-shadow-sm"
          >
            Create Now!
          </button>
        </div>
      </div>
    </div>
  );
}