import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-start justify-center h-96 text-green-400 text-2xl space-y-2">
            <p>&gt; BOOTING G.A.D. KERNEL...</p>
            <p>&gt; ESTABLISHING SECURE UPLINK...</p>
            <p className="text-yellow-400">&gt; ACCESSING GLOBAL INTELLIGENCE GRID...</p>
            <p className="text-yellow-400">&gt; COMPILING THREAT MATRIX...</p>
            <div className="flex items-center">
                <p className="text-cyan-400 text-glow">&gt; QUERYING AI CORE FOR ANALYSIS</p>
                <span className="ml-2 text-3xl bg-green-400 text-black cursor-blink">_</span>
            </div>
        </div>
    );
};

export default Loader;
