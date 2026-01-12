
import { GoogleGenAI, Type } from "@google/genai";
import { DecisionIntelligenceResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are a Founder Decision Intelligence Engine built for a high-culture, scarcity-driven streetwear brand.
Your role is to support founder-level decisions around timing, scarcity, cultural signals, and access control.

OPERATING PRINCIPLES:
1. Decision Supremacy: Compress complex data into clear decisions. Clarity over completeness.
2. The 4% Principle: Identify the small subset of audience behavior that drives outcomes.
3. Culture First: Protect brand mystique, scarcity, and unpredictability.
4. Memory Building: Extract compounding intelligence from each drop.

TONE:
Minimal. Direct. Certain. No hype, emojis, or marketing language. Private advisor style.

OUTPUT STRUCTURE:
You must provide a structured JSON response including:
1. Decision Context
2. Minimal, high-impact data for visualization (Line, Scatter, Bar, Treemap, or Histogram)
3. Feature → Benefit explanation for each graph
4. Clear decision guidance
5. Risk or dilution warning

The graphs should be strictly functional:
- Line Charts: Track demand or intent over time
- Scatter Plots: Reveal relationships (e.g., quantity vs secondary market price)
- Bar Charts: Compare signals
- Treemaps: Revenue or intent concentration
- Histograms: Distribution of behavior
`;

export const getDecisionIntelligence = async (prompt: string): Promise<DecisionIntelligenceResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          context: { type: Type.STRING, description: "Minimal explanation of the current decision scenario." },
          charts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['LINE', 'SCATTER', 'BAR', 'TREEMAP', 'HISTOGRAM'] },
                title: { type: Type.STRING },
                data: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.NUMBER },
                      secondaryValue: { type: Type.NUMBER }
                    },
                    required: ["name", "value"]
                  }
                },
                feature: { type: Type.STRING },
                benefit: { type: Type.STRING },
                insight: { type: Type.STRING },
                xAxisLabel: { type: Type.STRING },
                yAxisLabel: { type: Type.STRING }
              },
              required: ["type", "title", "data", "feature", "benefit", "insight"]
            }
          },
          guidance: { type: Type.STRING, description: "Direct, high-conviction decision guidance." },
          risk: { type: Type.STRING, description: "Warning regarding brand dilution or strategic risk." }
        },
        required: ["context", "charts", "guidance", "risk"]
      }
    }
  });

  return JSON.parse(response.text);
};
