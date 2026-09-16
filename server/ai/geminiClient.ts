import { GoogleGenAI } from "@google/genai";

let genAIInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIInstance;
}

export async function generateJSONWithGemini<T>(prompt: string, fallbackGenerator: () => T): Promise<T> {
  const ai = getGeminiClient();
  if (!ai) {
    return fallbackGenerator();
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return fallbackGenerator();
    }
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn("Gemini API call failed, using heuristic engine:", error);
    return fallbackGenerator();
  }
}

export async function generateTextWithGemini(prompt: string, fallback: string): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    return fallback;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text?.trim() || fallback;
  } catch (error) {
    console.warn("Gemini text call failed, using fallback:", error);
    return fallback;
  }
}
