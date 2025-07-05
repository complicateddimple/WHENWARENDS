
import { AnalysisResult } from '../types';

export const analyzeSituation = async (signal?: AbortSignal): Promise<AnalysisResult> => {
  try {
    // This now calls our own secure function, which will live at this special Netlify path.
    const response = await fetch('/.netlify/functions/analyze', { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data: AnalysisResult = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch analysis from backend:", error);
    if (error instanceof Error) {
        // Allow AbortError to be caught by the caller
        if (error.name === 'AbortError') {
            throw error;
        }
        throw new Error(`Could not connect to the analysis service: ${error.message}`);
    }
    throw new Error("Could not connect to the analysis service.");
  }
};