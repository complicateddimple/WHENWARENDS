
import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Types need to be redefined here as this function runs in a separate environment.
interface Source {
  uri: string;
  title: string;
}

interface OutcomeProbabilities {
    ukraineWin: number;
    frozenConflict: number;
    russiaWin: number;
}

interface AnalysisResult {
  timelineCategory: string;
  timelineJustification: string;
  sources: Source[];
  outcomeProbabilities: OutcomeProbabilities;
}

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


const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { API_KEY } = process.env;

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API key is not configured on the server." }),
        };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = buildPrompt();

    try {
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

        const finalResult = { ...parsedData, sources };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalResult),
        };

    } catch (error) {
        console.error("Error in Netlify function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Failed to get analysis from AI service: ${errorMessage}` }),
        };
    }
};

export { handler };
