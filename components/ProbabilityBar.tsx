import React, { useState, useEffect } from 'react';
import { OutcomeProbabilities } from '../types';

interface ProbabilityBarProps {
    probabilities: OutcomeProbabilities;
}

const outcomes = [
    { key: 'ukraineWin', label: 'Ukraine Victory', color: 'bg-ukraine-blue' },
    { key: 'frozenConflict', label: 'Frozen Conflict', color: 'bg-gray-500' },
    { key: 'russiaWin', label: 'Russia Victory', color: 'bg-red-600' },
] as const; // Use 'as const' for stricter typing

// Custom hook to animate numbers counting up
const useCountUp = (endValue: number, duration: number = 1200) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const current = Math.min(Math.round((progress / duration) * endValue), endValue);
            setCount(current);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);
    return count;
};

const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ probabilities }) => {
    const [animatedProbs, setAnimatedProbs] = useState({ ukraineWin: 0, frozenConflict: 0, russiaWin: 0 });
    const [hoveredKey, setHoveredKey] = useState<typeof outcomes[number]['key'] | null>(null);

    // Animate the bar widths on load
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProbs(probabilities);
        }, 100); // Delay to allow CSS transition to catch the change
        return () => clearTimeout(timer);
    }, [probabilities]);

    const displayPercentages = {
        ukraineWin: useCountUp(probabilities.ukraineWin),
        frozenConflict: useCountUp(probabilities.frozenConflict),
        russiaWin: useCountUp(probabilities.russiaWin),
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="h-4 w-full rounded-full bg-gray-800/70 flex overflow-hidden shadow-inner border border-white/5">
                {outcomes.map(outcome => (
                    <div
                        key={outcome.key}
                        style={{ width: `${animatedProbs[outcome.key]}%` }}
                        className={`
                            ${outcome.color} 
                            transition-all duration-1000 ease-out 
                            ${hoveredKey && hoveredKey !== outcome.key ? 'opacity-40' : 'opacity-100'}
                            ${hoveredKey === outcome.key ? 'brightness-125' : ''}
                        `}
                        title={`${outcome.label}: ${probabilities[outcome.key]}%`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm mt-5 text-gray-300">
                {outcomes.map(outcome => (
                    <div 
                        key={outcome.key} 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5
                            ${hoveredKey === outcome.key ? 'bg-white/10' : ''}
                        `}
                        onMouseEnter={() => setHoveredKey(outcome.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                    >
                        <div className={`h-3 w-3 rounded-full ${outcome.color} flex-shrink-0`}></div>
                        <span className="font-medium flex-grow">{outcome.label}</span>
                        <span className="font-semibold text-lg text-white tabular-nums">
                            {displayPercentages[outcome.key]}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProbabilityBar;