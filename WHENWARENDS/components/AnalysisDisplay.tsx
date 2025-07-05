import React from 'react';
import { AnalysisResult } from '../types';
import TimelineGauge from './TimelineGauge';
import ProbabilityBar from './ProbabilityBar';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

const SourceLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 inline-block ml-1 opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const { timelineCategory, timelineJustification, sources, outcomeProbabilities } = analysis;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* Prediction Card */}
        <div className="glass-panel p-6 md:p-8 text-center animate-fade-in-up interactive-panel">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 uppercase tracking-wider mb-6 md:mb-8">
                WHEN THE WAR IN UKRAINE <span role="img" aria-label="Ukrainian Flag">{'\u{1F1FA}\u{1F1E6}'}</span> WILL BE OVER
            </h2>
            <TimelineGauge category={timelineCategory} />
            <p className="text-lg md:text-xl font-light text-gray-200 mt-6 md:mt-8 max-w-3xl mx-auto">
                {timelineJustification}
            </p>

            <hr className="border-t border-white/10 my-6 md:my-8" />

            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 uppercase tracking-wider mb-6 md:mb-8">
                LONG-TERM OUTCOME PROBABILITY
            </h2>
            <ProbabilityBar probabilities={outcomeProbabilities} />
        </div>
            
        {/* Sources Panel */}
        {sources && sources.length > 0 && (
             <div className="glass-panel p-6 animate-fade-in-up interactive-panel" style={{ animationDelay: `300ms` }}>
                <h3 className="text-center text-sm font-semibold uppercase text-gray-400 tracking-widest mb-4">
                    Information Sources
                </h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-center text-xs">
                    {sources.map((source, index) => (
                    <li 
                      key={index}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${400 + index * 50}ms` }}
                    >
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-ukraine-blue hover:text-ukraine-yellow transition-all duration-200 truncate flex items-center justify-center group transform hover:scale-105"
                          title={source.title}
                        >
                          <span className="truncate">{new URL(source.uri).hostname.replace('www.','')}</span>
                          <SourceLinkIcon />
                        </a>
                    </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default AnalysisDisplay;