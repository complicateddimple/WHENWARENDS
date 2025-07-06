
// This is a Netlify Function, which runs in a Node.js environment.
// NOTE: You must add `@google/genai` as a dependency to your project's `package.json`.
const { GoogleGenAI } = require("@google/genai");

/**
 * Retrieves the API key from Netlify's environment variables.
 * @returns {string} The API key.
 * @throws {Error} If the API_KEY is not set.
 */
const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This will be logged in the Netlify function logs
    console.error("API_KEY environment variable not set in Netlify.");
    throw new Error("Server configuration error: API key not found.");
  }
  return apiKey;
};

/**
 * Creates the prompt for the Gemini model.
 * @returns {string} The formatted prompt string.
 */
const createPrompt = () => {
    const context = `Based on your most current knowledge up to today's date,`;

  return `${context}

Analyze the current state of the war in Ukraine. Provide your analysis in a structured JSON format. The JSON object must have the exact following keys and value types:
1.  "prediction": A string with your forecast for the end of the war. It MUST be one of the following three values: "Not Soon", "Likely Soon", or "Likely Very Soon".
2.  "keyFactors": An array of exactly 4 strings. Each string must be a brief, impactful summary of a key factor influencing the war's trajectory.
3.  "probabilities": An object with three keys: "ukraineVictory", "frozenConflict", and "russiaVictory". The values must be numbers (integer, 0-100) representing the percentage probability of each outcome, and their sum must equal 100.

Use the following definitions for the outcomes:
- "ukraineVictory": Complete military and political collapse of the current Russian regime, leading to Ukraine restoring its internationally recognized 1991 borders.
- "frozenConflict": A long-term cessation of major combat operations without a formal peace treaty, with front lines becoming de facto borders.
- "russiaVictory": Russia achieves its strategic objectives. This could mean it legally keeps the territories it has taken, the installation of a pro-Russian government in Kyiv, or the collapse of the Ukrainian state.

Do not include any explanations, introductory text, or markdown code fences (like \`\`\`json) outside of the raw JSON object. Your entire response must be only the JSON object itself.
`;
};

/**
 * The main handler for the Netlify Function.
 * It processes POST requests to generate the war analysis.
 */
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const prompt = createPrompt();
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        },
    });

    const rawText = response.text;
    if (!rawText) {
        throw new Error("Gemini API returned an empty response.");
    }
    
    // The response should be a clean JSON string, but we'll clean it up just in case
    // to handle potential markdown fences from the model.
    let jsonStr = rawText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedData),
    };

  } catch (error) {
    console.error("Error in Netlify function get-analysis:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get analysis from Gemini API.", details: errorMessage }),
    };
  }
};