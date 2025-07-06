import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from '../types';

// Use a global variable to hold the initialized client, to avoid re-initializing.
let ai: InstanceType<typeof GoogleGenAI> | null = null;

/**
 * Initializes and returns the GoogleGenAI client.
 * Throws an error if the API key is not available in the environment.
 */
function getAiClient(): InstanceType<typeof GoogleGenAI> {
    if (ai) {
        return ai;
    }

    // In a standard browser environment like a Netlify deployment without a build step,
    // `process.env.API_KEY` will fail because `process` is not defined. The coding
    // guidelines require using this exact variable. This check safely handles the
    // case where the environment doesn't provide it, preventing a crash and
    // surfacing a clear error to the user.
    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
        throw new Error("API_KEY not found. Please ensure it is configured in your deployment environment (e.g., Netlify build settings) and made accessible to client-side code.");
    }

    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
}


export const fetchWarAnalysis = async (): Promise<AnalysisResponse> => {
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format

    const prompt = `
    Analyze the current geopolitical situation regarding the war in Ukraine as of today's date, ${currentDate}. Based on publicly available information, news, and expert analyses, provide a forecast.

    Your response MUST be in a valid JSON format. Do not include any text, explanations, or markdown fences like \`\`\`json\`\`\` outside of the raw JSON object.

    The JSON object must follow this exact structure:

    {
      "warEndForecast": "ENUM_VALUE",
      "keyFactors": [
        {
          "title": "Factor Title 1",
          "impact": "A concise, one-sentence analysis of this factor's impact on the war's timeline and outcome.",
          "trend": "ENUM_TREND"
        },
        {
          "title": "Factor Title 2",
          "impact": "A concise, one-sentence analysis of this factor's impact on the war's timeline and outcome.",
          "trend": "ENUM_TREND"
        },
        {
          "title": "Factor Title 3",
          "impact": "A concise, one-sentence analysis of this factor's impact on the war's timeline and outcome.",
          "trend": "ENUM_TREND"
        }
      ],
      "outcomeProbability": {
        "ukraineVictory": "INTEGER_PERCENTAGE",
        "stalemate": "INTEGER_PERCENTAGE",
        "russiaVictory": "INTEGER_PERCENTAGE"
      }
    }

    Constraints and definitions:

    1.  "warEndForecast": Must be one of these three exact string values: "NOT_SOON", "LIKELY_SOON", "LIKELY_VERY_SOON".
    2.  "keyFactors": Provide exactly 3 diverse and critical key factors influencing the conflict.
    3.  "trend": For each factor, it must be one of these three string values: "POSITIVE_FOR_UKRAINE", "NEGATIVE_FOR_UKRAINE", "NEUTRAL".
    4.  "outcomeProbability":
        *   The sum of "ukraineVictory", "stalemate", and "russiaVictory" must be exactly 100.
        *   "ukraineVictory" definition: Russia collapses militarily or politically, leading to Ukraine restoring its 1991 borders.
        *   "russiaVictory" definition: Russia achieves strategic goals, including legal retention of occupied territories, installing a pro-Russian government, or a military collapse of Ukraine leading to Kyiv's fall.
        *   "stalemate" definition: A frozen conflict with no clear victor, where major fighting largely ceases but territorial disputes and political tensions remain unresolved for the foreseeable future.
        *   The percentages must be integers.

    Provide a realistic, neutral, and data-driven analysis based on the current state of the conflict.
    `;

    try {
        const client = getAiClient(); // Lazily initialize, will throw if API key is missing.
        
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.5,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        
        const parsedData = JSON.parse(jsonStr);
        
        // Basic validation
        if (!parsedData.warEndForecast || !parsedData.keyFactors || !parsedData.outcomeProbability) {
            throw new Error("Invalid data structure received from API.");
        }

        return parsedData as AnalysisResponse;

    } catch (error) {
        console.error("Error in fetchWarAnalysis:", error);
        // Re-throw the error to be caught by the UI component.
        // This preserves the specific error message (e.g., from API key check or JSON parsing).
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred during AI analysis.");
    }
};