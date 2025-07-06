
import type { AnalysisResult } from '../types';

/**
 * Fetches the analysis from a secure backend Netlify Function.
 * This function acts as a proxy to the Gemini API, keeping the API key secret.
 * @returns A promise that resolves to the analysis result.
 */
export const getAnalysis = async (): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/.netlify/functions/get-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to parse error from the function's response body
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Analysis service returned an error. Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data: AnalysisResult = await response.json();
    
    // Client-side validation to ensure the data is what we expect
    if (
        !data.prediction ||
        !['Not Soon', 'Likely Soon', 'Likely Very Soon'].includes(data.prediction) ||
        !Array.isArray(data.keyFactors) ||
        !data.probabilities ||
        typeof data.probabilities.ukraineVictory !== 'number' ||
        typeof data.probabilities.frozenConflict !== 'number' ||
        typeof data.probabilities.russiaVictory !== 'number'
    ) {
        throw new Error("Received malformed analysis data from the server.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching analysis from backend function:", error);
    // Re-throw a user-friendly error to be caught by the UI component
    if (error instanceof Error) {
        throw new Error(`Failed to generate analysis. ${error.message}`);
    }
    throw new Error("Failed to generate analysis due to an unknown network error.");
  }
};