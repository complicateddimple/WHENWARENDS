
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-2 border-blue-500/40 rounded-full animate-spin" style={{ animationDelay: '-0.1s' }}></div>
        <div className="absolute inset-4 border-2 border-blue-500/50 rounded-full animate-spin" style={{ animationDelay: '-0.2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        </div>
      </div>
      <p className="text-lg text-gray-400 font-roboto-mono animate-pulse">ANALYSING DATA...</p>
    </div>
  );
};

export default Loader;
