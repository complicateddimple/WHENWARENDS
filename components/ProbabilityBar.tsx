
import React, { useState, useEffect } from 'react';
import type { Probabilities } from '../types';

interface ProbabilityBarProps {
  probabilities: Probabilities;
}

const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ probabilities }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after component mounts
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { ukraineVictory, frozenConflict, russiaVictory } = probabilities;

  const segments = [
    { label: 'Ukraine Victory', value: ukraineVictory, color: 'bg-blue-500', glow: 'text-glow-blue' },
    { label: 'Frozen Conflict', value: frozenConflict, color: 'bg-gray-500', glow: 'text-glow-gray' },
    { label: 'Russia Victory', value: russiaVictory, color: 'bg-red-600', glow: 'text-glow-red' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
       <div className="flex h-10 w-full rounded-full overflow-hidden bg-gray-800 border border-gray-700">
        {segments.map((seg, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-white font-bold text-sm transition-all duration-1000 ease-out ${seg.color}`}
            style={{ width: isAnimated ? `${seg.value}%` : '0%' }}
          >
          </div>
        ))}
      </div>
      <div className="flex justify-between items-start -mt-2">
        {segments.map((seg, index) => (
            <div key={index} className="flex flex-col items-center text-center px-2" style={{width: `${seg.value}%`}}>
                <p className={`font-bold text-3xl md:text-4xl transition-all duration-1000 ${isAnimated ? 'opacity-100' : 'opacity-0'} ${seg.glow}`} style={{ transitionDelay: `${300 + index * 150}ms`}}>
                    {seg.value}%
                </p>
                <p className="text-gray-400 text-sm md:text-base font-semibold">
                    {seg.label}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProbabilityBar;
