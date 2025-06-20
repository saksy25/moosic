import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Counselling = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending');
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);

  const radiusOptions = [1, 2, 5, 10, 15, 20, 25, 50];

  // Sample counsellors data
  const sampleCounsellors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      address: '123 Wellness Street, Mumbai, Maharashtra',
      specialization: 'Anxiety & Depression',
      distance: 2.3,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Rajesh Patel',
      address: '456 Mental Health Center, Bandra, Mumbai',
      specialization: 'Cognitive Behavioral Therapy',
      distance: 4.1,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      address: '789 Mindful Care Clinic, Andheri, Mumbai',
      specialization: 'Family & Relationship Therapy',
      distance: 6.7,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Dr. Amit Kumar',
      address: '321 Healing Minds, Powai, Mumbai',
      specialization: 'Trauma & PTSD',
      distance: 8.2,
      rating: 4.6
    }
  ];

  const requestLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission('granted');
          setLoading(false);
          filterCounsellors();
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          setLoading(false);
          setCounsellors(sampleCounsellors);
        }
      );
    } else {
      setLocationPermission('not-supported');
      setLoading(false);
      setCounsellors(sampleCounsellors);
    }
  };

  const filterCounsellors = () => {
    const filtered = sampleCounsellors.filter(counsellor => counsellor.distance <= selectedRadius);
    setCounsellors(filtered);
  };

  const handleRadiusChange = (radius) => {
    setSelectedRadius(radius);
    setShowRadiusModal(false);
    if (locationPermission === 'granted') {
      filterCounsellors();
    }
  };

  useEffect(() => {
    if (locationPermission === 'granted') {
      filterCounsellors();
    }
  }, [selectedRadius]);

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Navbar />
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <h2 className="text-2xl font-semibold text-gray-800">Counsellors Near You</h2>
      </div> */}

      <Navbar />
      <div className="flex-1 bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-sm">Counsellors Near You</h2>

      {/* Content Area */}
      <div className="px-8">
        {/* Location & Radius Controls */}
        <div className="mb-8 flex items-center space-x-4">
          <button
            onClick={() => setShowRadiusModal(true)}
            className="bg-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
          >
            Set the radius ({selectedRadius} km)
          </button>
          
          {locationPermission === 'pending' && (
            <button
              onClick={requestLocation}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Getting Location...' : 'Get My Location'}
            </button>
          )}

          {locationPermission === 'granted' && (
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">📍</span>
              <span>Location enabled</span>
            </div>
          )}

          {locationPermission === 'denied' && (
            <div className="flex items-center text-red-600">
              <span className="text-xl mr-2">❌</span>
              <span>Location access denied - showing all counsellors</span>
            </div>
          )}
        </div>

        {/* Counsellors List */}
        <div className="space-y-4">
          {counsellors.length === 0 && locationPermission === 'pending' && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Find Counsellors Near You</h3>
              <p>Enable location access and set your preferred radius to discover nearby counsellors.</p>
            </div>
          )}

          {counsellors.map((counsellor) => (
            <div
              key={counsellor.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{counsellor.name}</h3>
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Address:</span> {counsellor.address}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Specialization:</span> {counsellor.specialization}
                  </div>
                  {locationPermission === 'granted' && (
                    <div className="text-gray-600 mb-2">
                      <span className="font-medium">Distance:</span> {counsellor.distance} km away
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-600 ml-1">{counsellor.rating}/5</span>
                  </div>
                </div>
                <button 
                  onClick={() => openGoogleMaps(counsellor.address)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  See on Map
                </button>
              </div>
            </div>
          ))}

          {counsellors.length === 0 && locationPermission === 'granted' && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No counsellors found</h3>
              <p>Try increasing your search radius to find more counsellors in your area.</p>
            </div>
          )}
        </div>
      </div>

      {/* Radius Selection Modal */}
      {showRadiusModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 shadow-xl flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-xl font-semibold mb-4">Select Search Radius</h3>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {radiusOptions.map((radius) => (
                <button
                  key={radius}
                  onClick={() => handleRadiusChange(radius)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedRadius === radius
                      ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRadiusModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              {/* <button
                onClick={() => handleRadiusChange(selectedRadius)}
                className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500"
              >
                Apply
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div> 
    </div>
  );
};

export default Counselling;