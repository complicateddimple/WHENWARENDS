import React from 'react';

interface LoaderProps {
  progress: number;
  isHiding: boolean;
}

const Loader: React.FC<LoaderProps> = ({ progress, isHiding }) => {
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${isHiding ? 'animate-fade-out' : 'opacity-100'}`}>
        <div className="w-full fixed top-0 left-0 h-1">
            <div 
                className="h-1 bg-ukraine-yellow transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      <div className="text-center">
        <p className="text-7xl font-bold tabular-nums tracking-tighter">
            <span className="animate-text-gradient">
                {Math.round(progress)}<span className="text-5xl">%</span>
            </span>
        </p>
        <p className="mt-2 text-lg text-gray-400 animate-pulse">
            Analyzing latest geopolitical data...
        </p>
      </div>
    </div>
  );
};

export default Loader;