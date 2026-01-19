import { GoogleGenAI } from "@google/genai";

// NOTE: This assumes process.env.API_KEY is available. 
// If not, it gracefully fails or returns mock data.

export const enhanceText = async (text: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing. Returning original text.");
    return text + " (AI Enhancement unavailable - missing API Key)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `You are a helpful editor. Improve the following text for a personal social media post. Fix grammar, make it slightly more engaging, but keep the original meaning and tone. Keep it concise.
    
    Original Text: "${text}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text;
  }
};
