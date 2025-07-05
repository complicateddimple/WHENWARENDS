
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeSituation } from './services/geminiService';
import { AnalysisResult } from './types';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import AnalysisDisplay from './components/AnalysisDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hidingLoader, setHidingLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const performAnalysis = useCallback(async () => {
    setLoading(true);
    setHidingLoader(false);
    setError(null);
    setAnalysis(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
    }, 250);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 28000); // 28-second client-side timeout, slightly longer than server timeout

    try {
      const analysisResult = await analyzeSituation(controller.signal);
      
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setHidingLoader(true);
        setTimeout(() => {
          setAnalysis(analysisResult);
          setLoading(false);
          setHidingLoader(false);
        }, 500); // Wait for fade-out animation
      }, 500); // Show 100% for a moment

    } catch (err) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      console.error(err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError("The analysis request timed out. The server may be busy. Please try again in a moment.");
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Analysis failed: ${errorMessage}`);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

  const showContent = !loading && !hidingLoader;

  return (
    <div className="min-h-screen font-sans flex flex-col pt-8 md:pt-16">
      {loading && <Loader progress={progress} isHiding={hidingLoader} />}
      <main className="flex-grow w-full container mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
        {showContent && error && <ErrorDisplay message={error} onRetry={performAnalysis} />}
        {showContent && analysis && (
          <AnalysisDisplay analysis={analysis} />
        )}
      </main>
      {showContent && analysis && (
        <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;