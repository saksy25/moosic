import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Mood Analysis', icon: '📊', path: '/mood-analysis' },
    { name: 'Counselling', icon: '💬', path: '/counselling' },
    { name: 'Mood History', icon: '📈', path: '/mood-history' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-80 bg-gradient-to-b from-pink-200 to-purple-200 p-6 shadow-lg min-h-screen">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-purple-600 drop-shadow-lg">
          MOOSIC
        </h1>
        <div className="w-full h-0.5 bg-gray-400 mt-2 drop-shadow-sm"></div>
      </div>

      {/* Navigation */}
      <nav className="space-y-3 mb-8">
        {sidebarItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 shadow-md drop-shadow-sm ${
              location.pathname === item.path
                ? 'bg-pink-300 text-purple-800 shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-white/90'
            }`}
          >
            <span className="text-xl drop-shadow-sm">{item.icon}</span>
            <span className="font-semibold drop-shadow-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto pt-8 border-t border-white/30">
        <div className="flex items-center space-x-3 mb-4 p-3 bg-white/50 rounded-xl">
          <div className="w-10 h-10 bg-gray-300 rounded-full shadow-md drop-shadow-sm"></div>
          <span className="text-orange-500 font-bold text-sm drop-shadow-sm">
            {user?.name || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-md drop-shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;