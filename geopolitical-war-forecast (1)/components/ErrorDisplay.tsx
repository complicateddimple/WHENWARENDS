import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-red-600 bg-red-900/30 p-4 text-center">
            <h2 className="text-4xl font-bold text-red-500 mb-4 text-glow" style={{'--glow-color': '#f00'} as React.CSSProperties}>
                !! SYSTEM ALERT !!
            </h2>
            <p className="text-2xl text-red-400">ANALYSIS FAILED: CONNECTION INTERRUPTED</p>
            <div className="mt-6 p-4 border border-yellow-500/50 bg-black/50 w-full">
                 <p className="text-xl text-yellow-400">{message}</p>
            </div>
        </div>
    );
};

export default ErrorDisplay;
