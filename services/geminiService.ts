
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, OutcomeProbabilities, Source } from '../types';

const buildPrompt = (): string => {
  const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  return `
    Analyze the current geopolitical situation of the war in Ukraine as of ${currentDate}. Your analysis must be objective, data-driven, and based on the most recent and credible information available via Google Search.

    Your primary tasks are:
    1.  Categorize the conflict's likely end into one of three specific timeline categories: "NOT_SOON", "SOON", or "VERY_SOON".
    2.  Provide a single, concise sentence justifying your timeline choice.
    3.  Provide a percentage-based probability for three potential long-term outcomes based on the strict definitions below. The sum of these three probabilities MUST equal 100.

    Outcome Definitions:
    - "ukraineWin": Complete Ukrainian victory, defined as Russia collapsing politically or militarily, allowing Ukraine to restore its full 1991 borders.
    - "russiaWin": Complete Russian victory, defined as the installation of a pro-Russian government in Kyiv, the downfall of the current Ukrainian state, the capture of Kyiv, or Russia legally keeping the territories it has taken.
    - "frozenConflict": A long-term cessation of active, large-scale hostilities without a formal peace treaty, with lines of control remaining relatively static and unresolved territorial disputes.

    Your response MUST be a valid JSON object with the following structure. Do not include any other text, explanations, or markdown fences.
    {
      "timelineCategory": "NOT_SOON",
      "timelineJustification": "The conflict is expected to be protracted due to entrenched positions and the continuous flow of international military aid.",
      "outcomeProbabilities": {
        "ukraineWin": 30,
        "frozenConflict": 55,
        "russiaWin": 15
      }
    }
  `;
};

const cleanText = (text: string): string => {
    if (!text) return "";
    return text.replace(/\s*\[\d+(,\s*\d+)*\]/g, '').trim();
};

const validateProbabilities = (probs: OutcomeProbabilities): boolean => {
    if (!probs) return false;
    const { ukraineWin, frozenConflict, russiaWin } = probs;
    if (typeof ukraineWin !== 'number' || typeof frozenConflict !== 'number' || typeof russiaWin !== 'number') {
        return false;
    }
    const sum = Math.round(ukraineWin + frozenConflict + russiaWin);
    return sum === 100;
};


const callGeminiDirectly = async (): Promise<AnalysisResult> => {
    console.log("Running in local mode. Calling Gemini API directly...");
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY secret is not set. Please add it in the AI Studio secrets panel.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt();

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            temperature: 0.2,
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Source[] = groundingMetadata
        ?.map((chunk) => chunk.web)
        .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web?.title)
        .filter((value, index, self) => self.findIndex(s => s.uri === value.uri) === index)
        ?? [];

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    const parsedData: Omit<AnalysisResult, 'sources'> = JSON.parse(jsonStr);

    parsedData.timelineJustification = cleanText(parsedData.timelineJustification);

    if (!parsedData.timelineCategory || !parsedData.timelineJustification || !parsedData.outcomeProbabilities) {
        throw new Error("AI response is missing required fields.");
    }
    if (!validateProbabilities(parsedData.outcomeProbabilities)) {
        throw new Error("AI response's probabilities are invalid or do not sum to 100.");
    }

    return { ...parsedData, sources };
}

const callNetlifyFunction = async (signal?: AbortSignal): Promise<AnalysisResult> => {
    console.log("Running in deployed mode. Calling Netlify function...");
    const response = await fetch('/.netlify/functions/analyze', { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data: AnalysisResult = await response.json();
    return data;
}


export const analyzeSituation = async (signal?: AbortSignal): Promise<AnalysisResult> => {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  try {
    if (isLocal) {
        return await callGeminiDirectly();
    } else {
        return await callNetlifyFunction(signal);
    }
  } catch (error) {
    console.error("Failed to fetch analysis:", error);
    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            // Re-throw AbortError so the UI can handle it specifically.
            throw error;
        }
        throw new Error(`Could not connect to the analysis service: ${error.message}`);
    }
    // Fallback for non-Error objects.
    throw new Error("Could not connect to the analysis service due to an unknown issue.");
  }
};
