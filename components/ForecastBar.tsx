
import React, { useState, useEffect } from 'react';
import type { Forecast } from '../types';

interface ForecastBarProps {
  prediction: Forecast;
}

const levelMap: Record<Forecast, number> = {
  'Not Soon': 0,
  'Likely Soon': 1,
  'Likely Very Soon': 2
};

const segments = ['NOT SOON', 'SOON', 'VERY SOON'];

const ForecastBar: React.FC<ForecastBarProps> = ({ prediction }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const activeIndex = levelMap[prediction];

  return (
    <div className="relative flex w-full max-w-md mx-auto border border-gray-700 bg-gray-900/50 rounded-full p-1.5">
      <div
        className="absolute top-1.5 bottom-1.5 h-auto w-1/3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${isAnimated ? activeIndex * 100 : 0}%)` }}
      />
      {segments.map((label, index) => (
        <div
          key={label}
          className="relative z-10 flex-1 text-center py-2.5 font-bold tracking-wider transition-colors duration-500"
        >
          <span className={isAnimated && activeIndex === index ? 'text-white' : 'text-gray-400'}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ForecastBar;
