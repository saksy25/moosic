import React from 'react';
import backgroundImage from '../assets/bg.webp';

const MoosicLanding = () => {
  return (
    
      <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4 bg-white">
        <h1 className="text-5xl font-bold text-purple-600 text-shadow-md text-shadow-purple-900">MOOSIC</h1>
        <div className="flex gap-6">
          <a href='/login' className="text-white px-4 py-2 rounded-xl font-bold text-xl bg-pink-500 hover:bg-pink-600 transition-colors">
            LOGIN
          </a>
          <a href='/signup' className="py-2 text-pink-500 font-bold text-xl hover:text-pink-600 transition-colors">
            SIGNUP
          </a>
        </div>
      </header>

      {/* Background image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${backgroundImage})`}}
      >
        {/* <img className='absolute object-fill' src={backgroundImage}></img> */}
      </div>
      <div className="absolute inset-0 bg-black/25 z-0"></div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Main heading */}
          <h2 className="text-6xl md:text-8xl font-family-sans font-extrabold text-white mb-8 leading-tight text-shadow-lg text-shadow-amber-500 drop-shadow-amber-500">
              CAPTURES YOUR MOOD AND HEALS IT WITH MUSIC
          </h2>
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-12 font-family-sans text-shadow-xs text-shadow-pink-700 font-medium">
            ...Because every emotion deserves its own soundtrack...
          </p>
          {/* CTA Button */}
          <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-bounce">
            <a href='/login' >ANALYZE NOW!</a>
          </button>
        </div>
      </main>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-teal-400 rounded-full animate-ping"></div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MoosicLanding;