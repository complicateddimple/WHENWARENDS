
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="glass-panel text-red-100 px-6 py-5 max-w-2xl mx-auto text-center shadow-lg animate-fade-in-up" role="alert">
      <strong className="font-bold block mb-2 text-red-300">Analysis Failed</strong>
      <span className="block sm:inline">{message}</span>
      <button 
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors duration-200"
      >
        Retry Analysis
      </button>
    </div>
  );
};

export default ErrorDisplay;
