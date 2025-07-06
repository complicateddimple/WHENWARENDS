import React, { useState, useEffect } from 'react';
import { AnalysisResponse } from './types';
import { fetchWarAnalysis } from './services/geminiService';
import Header from './components/Header';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
    const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getAnalysis = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchWarAnalysis();
                setAnalysisData(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(`Failed to retrieve analysis. ${err.message}. Ensure your API key is configured correctly.`);
                } else {
                    setError("An unknown error occurred.");
                }
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Simulate a longer boot sequence for aesthetic purposes
        setTimeout(getAnalysis, 1500);
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <ErrorDisplay message={error} />;
        }
        if (analysisData) {
            return <AnalysisDisplay data={analysisData} />;
        }
        // Render an empty div if there's no data and not loading/error to prevent empty UI on Netlify
        return <div style={{ minHeight: '50vh' }}></div>;
    };

    return (
        <div className="min-h-screen bg-black text-green-400 p-2 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto border-2 border-green-700/50 p-4">
                <Header />
                <main className="mt-6">
                    {renderContent()}
                </main>
            </div>
             <footer className="text-center mt-8 text-green-700 text-lg">
                <p>CLASSIFICATION LEVEL IV // EYES ONLY</p>
                <p>SYNTHESIZED BY G.A.D. AI CORE // ALL ASSESSMENTS PROBABILISTIC</p>
            </footer>
        </div>
    );
};

export default App;
