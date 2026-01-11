
import { GoogleGenAI } from "@google/genai";

export class StoxaraService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[]) {
    try {
      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: `You are Stoxara, a premium institutional-grade financial intelligence AI. 
          Today is ${today}.
          
          Your mission is to provide sophisticated market intelligence and economic analysis.
          Use Google Search to find current data, trends, and news for today.
          
          Guidelines:
          1. Provide clear, data-driven reasoning for all financial queries.
          2. Use bolding for key metrics, events, or indicators.
          3. Format responses with bullet points for high readability.
          4. Focus on macroeconomic trends, industry shifts, and strategic financial outlooks.
          5. ALWAYS include a brief daily summary of the global financial atmosphere.
          6. Add a disclaimer that you are an AI and not a licensed financial advisor.
          
          Tone: Professional, sophisticated, and authoritative.`,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || "I apologize, I'm unable to process that request right now.";
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        ?.filter(web => web && web.uri && web.title)
        ?.map(web => ({ title: web.title, uri: web.uri })) || [];

      return { text, sources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { 
        text: "The financial intelligence bridge is experiencing latency. Please try again shortly.",
        sources: []
      };
    }
  }
}

export const stoxara = new StoxaraService();
