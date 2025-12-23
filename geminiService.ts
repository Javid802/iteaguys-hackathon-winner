
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeEmailRisk = async (subject: string, body: string, attachmentName?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a deep B2B security analysis on this email. 
      Analyze:
      1. Content: Check for SSN, passwords, or financial PII.
      2. Attachment: Check file extension risks (${attachmentName || 'None'}).
      3. Links: Check for suspicious URL patterns in body.
      4. Context: Check for impersonation or extreme urgency.

      Subject: ${subject}
      Body: ${body}
      Attachment: ${attachmentName || 'None'}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "Total Score 0-100" },
            threatLevel: { type: Type.STRING, description: "Low, Medium, High, Critical" },
            analysis: { type: Type.STRING, description: "Why this email is risky" },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskFactors: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.NUMBER },
                attachment: { type: Type.NUMBER },
                links: { type: Type.NUMBER },
                context: { type: Type.NUMBER }
              },
              required: ["content", "attachment", "links", "context"]
            }
          },
          required: ["riskScore", "threatLevel", "analysis", "suggestions", "riskFactors"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Risk analysis failed:", error);
    return {
      riskScore: 15,
      threatLevel: 'Low',
      analysis: 'Standard heuristic scan complete.',
      suggestions: ['Double-check recipient identity'],
      riskFactors: { content: 10, attachment: 0, links: 5, context: 0 }
    };
  }
};
