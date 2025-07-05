import { AnalysisResult } from '../types';

export const analyzeSituation = async (signal?: AbortSignal): Promise<AnalysisResult> => {
  console.log("Calling Netlify function...");
  
  try {
    const response = await fetch('/.netlify/functions/analyze', { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data: AnalysisResult = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch analysis from Netlify function:", error);
    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            // Re-throw AbortError so the UI can handle it specifically.
            throw error;
        }
        // Provide a more user-friendly error message
        throw new Error(`Could not connect to the analysis service. Please check your internet connection or try again later.`);
    }
    // Fallback for non-Error objects.
    throw new Error("Could not connect to the analysis service due to an unknown issue.");
  }
};
