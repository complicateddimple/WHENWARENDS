import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="border-b-2 border-green-700/50 pb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-green-400 text-glow">
                        G.A.D. TERMINAL
                    </h1>
                    <p className="text-xl text-green-500">UKRAINE CONFLICT ASSESSMENT [LIVE]</p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-2xl font-bold text-red-500 animate-pulse" style={{textShadow: '0 0 8px #f00'}}>TOP SECRET</p>
                    <p className="text-lg text-green-600">SID: {Date.now()}</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
