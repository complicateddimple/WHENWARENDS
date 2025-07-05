import React from 'react';
import { TimelineCategory } from '../types';

interface TimelineGaugeProps {
  category: TimelineCategory;
}

const segments = [
    { id: 'NOT_SOON', label: 'Not Soon', color: 'bg-red-500' },
    { id: 'SOON', label: 'Soon', color: 'bg-ukraine-yellow' },
    { id: 'VERY_SOON', label: 'Very Soon', color: 'bg-green-500' },
];

const TimelineGauge: React.FC<TimelineGaugeProps> = ({ category }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
        <div className="relative h-2.5 w-full rounded-full bg-gray-700/50 flex items-center">
            {segments.map((seg, index) => {
                const isActive = category === seg.id;
                return (
                    <div 
                        key={seg.id}
                        className={`h-full flex-1 transition-all duration-500 ease-out transform-gpu
                            ${index === 0 ? 'rounded-l-full' : ''} 
                            ${index === segments.length - 1 ? 'rounded-r-full' : ''} 
                            ${isActive ? `${seg.color} scale-y-[1.8] animate-pulse-shadow` : 'bg-gray-600/60'}`}
                    />
                );
            })}
        </div>
        <div className="flex justify-between text-xs mt-3 text-gray-400 px-1">
            {segments.map(seg => {
                 const isActive = category === seg.id;
                 return (
                    <span 
                        key={seg.id} 
                        className={`font-medium transition-all duration-300 text-center flex-1 
                            ${isActive ? 'animate-text-pulse-glow' : 'hover:text-white hover:scale-110'}`}
                    >
                        {seg.label}
                    </span>
                 )
            })}
        </div>
    </div>
  );
};

export default TimelineGauge;