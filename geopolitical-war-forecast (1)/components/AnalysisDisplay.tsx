import React, { useState, useEffect } from 'react';
import { AnalysisResponse, WarEndForecast, FactorTrend } from '../types';

interface AnalysisDisplayProps {
    data: AnalysisResponse;
}

const ForecastBar: React.FC<{ forecast: WarEndForecast }> = ({ forecast }) => {
    const [activeLevel, setActiveLevel] = useState(0);

    useEffect(() => {
        const levels = {
            [WarEndForecast.LikelyVerySoon]: 3,
            [WarEndForecast.LikelySoon]: 2,
            [WarEndForecast.NotSoon]: 1,
        };
        const timeout = setTimeout(() => setActiveLevel(levels[forecast]), 100);
        return () => clearTimeout(timeout);
    }, [forecast]);

    const options = [
        { label: 'NOT SOON', level: 1, color: 'bg-yellow-500' },
        { label: 'LIKELY SOON', level: 2, color: 'bg-orange-500' },
        { label: 'LIKELY VERY SOON', level: 3, color: 'bg-red-600' },
    ];

    return (
        <div className="flex w-full h-10 border-2 border-green-700/50 p-1 bg-black">
            {options.map((opt) => (
                <div
                    key={opt.level}
                    className={`flex-1 flex items-center justify-center text-lg font-bold transition-all duration-1000 mx-1 ${
                        activeLevel >= opt.level ? `${opt.color} text-black text-glow` : 'text-green-800'
                    } ${
                        activeLevel === opt.level ? 'animate-pulse' : ''
                    }`}
                    style={{'--glow-color': activeLevel >= opt.level ? '#fff' : 'transparent'} as React.CSSProperties}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    );
};

const TrendIcon: React.FC<{ trend: FactorTrend }> = ({ trend }) => {
    const styles = 'w-8 h-8 text-3xl';
    switch (trend) {
        case FactorTrend.PositiveForUkraine:
            return <div className={`${styles} text-green-400 text-glow`}>▲</div>;
        case FactorTrend.NegativeForUkraine:
            return <div className={`${styles} text-red-500 text-glow`} style={{'--glow-color': '#f00'} as React.CSSProperties}>▼</div>;
        case FactorTrend.Neutral:
            return <div className={`${styles} text-yellow-500 text-glow`} style={{'--glow-color': '#ff0'} as React.CSSProperties}>▬</div>;
        default:
            return null;
    }
};

const ProbabilityBar: React.FC<{ probabilities: AnalysisResponse['outcomeProbability'] }> = ({ probabilities }) => {
    const [widths, setWidths] = useState({ ukraine: 0, stalemate: 0, russia: 0 });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setWidths({
                ukraine: probabilities.ukraineVictory,
                stalemate: probabilities.stalemate,
                russia: probabilities.russiaVictory,
            });
        }, 100);
        return () => clearTimeout(timeout);
    }, [probabilities]);
    
    const BarSegment: React.FC<{ width: number, color: string, label: string }> = ({ width, color, label }) => {
        const blockChar = '█';
        const numBlocks = Math.round(width / 2); // Adjust divisor for bar length
        return (
            <div className="flex items-center my-1 w-full">
                <span className="w-1/3 text-green-400">{label}: [{width}%]</span>
                <span className={`w-2/3 text-left ${color} text-glow`} style={{'--glow-color': 'currentColor'} as React.CSSProperties}>
                    {blockChar.repeat(numBlocks)}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full bg-black/50 p-2 border border-green-700/30 text-2xl">
            <BarSegment width={widths.ukraine} color="text-green-500" label="UKRAINE VICTORY" />
            <BarSegment width={widths.stalemate} color="text-yellow-500" label="STALEMATE" />
            <BarSegment width={widths.russia} color="text-red-600" label="RUSSIA VICTORY" />
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <section className="border-2 border-green-700/50 p-4 mt-6 bg-black/30">
        <h2 className="text-3xl text-green-400 text-glow mb-4 uppercase tracking-widest">{title}</h2>
        {children}
    </section>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      // Stagger the animation of visibility for a more dramatic effect
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`space-y-6 transition-opacity duration-1000 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Section title="War End Forecast">
                <ForecastBar forecast={data.warEndForecast} />
            </Section>

            <Section title="Key Strategic Drivers">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.keyFactors.map((factor, index) => (
                        <div key={index} className="border border-green-800 p-3 bg-black/20 h-full flex flex-col">
                           <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl text-green-300 uppercase">{factor.title}</h3>
                                <TrendIcon trend={factor.trend} />
                           </div>
                            <p className="text-green-500 text-lg leading-tight flex-grow">{factor.impact}</p>
                        </div>
                    ))}
                </div>
            </Section>
            
            <Section title="Long-Term Outcome Probability">
                 <ProbabilityBar probabilities={data.outcomeProbability} />
            </Section>
        </div>
    );
};

export default AnalysisDisplay;
