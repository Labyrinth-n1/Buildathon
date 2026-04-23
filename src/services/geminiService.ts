import { GoogleGenAI, Type } from "@google/genai";
import { IndividualAnalysis, Severity, Case, EpidemicStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMultimodalEntry(description: string, imageBase64?: string): Promise<{ 
  diagnosis: IndividualAnalysis, 
  visionAnalysis?: { 
    detectedIndicators: string[],
    malnutritionRisk: {
      level: "low" | "medium" | "high",
      explanation: string
    },
    reasoning: string,
    confidenceScore: number,
    healthRecommendation: string
  } 
}> {
  try {
    const parts: any[] = [
      { text: `CONTEXT: Specialized Computer Vision for Public Health.
USER PROVIDED DESCRIPTION: ${description}

OBJECTIVE:
Analyze provided symptoms and images (if any) to detect health risks, primarily focusing on signs of malnutrition and visible health indicators.

RULES:
- Never give a definitive medical diagnosis.
- Always use probabilistic language.
- Always provide a confidence score.
- Always explain visual features detected if an image is present.
- Avoid identity recognition.` }
    ];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
      parts.push({ text: `INSTRUCTION FOR COMPUTER VISION:
Analyze the image specifically for:
1. Malnutrition detection: signs of undernutrition, wasting, stunting, edema, visible weight loss, or abnormal body/face proportions.
2. Health indicators: skin discoloration, fatigue signs, or abnormal appearance.
3. Risk interpretation: classify the level and urgency.` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: "You are a multimodal AI specialized in public health computer vision. You analyze text symptoms and images non-invasively to detect malnutrition and health anomalies. Return structured JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: {
              type: Type.OBJECT,
              properties: {
                diseases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      probability: { type: Type.NUMBER },
                      rationale: { type: Type.STRING }
                    },
                    required: ["name", "probability", "rationale"]
                  }
                },
                severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "CRITICAL"] },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER }
              },
              required: ["diseases", "severity", "recommendations", "confidence"]
            },
            visionAnalysis: {
              type: Type.OBJECT,
              properties: {
                detectedIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
                malnutritionRisk: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING, enum: ["low", "medium", "high"] },
                    explanation: { type: Type.STRING }
                  },
                  required: ["level", "explanation"]
                },
                reasoning: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                healthRecommendation: { type: Type.STRING }
              },
              required: ["detectedIndicators", "malnutritionRisk", "reasoning", "confidenceScore", "healthRecommendation"]
            }
          },
          required: ["diagnosis"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Multimodal AI Analysis Error:", error);
    return {
      diagnosis: {
        diseases: [{ name: "Analysis failure", probability: 0, rationale: "The system is momentarily unavailable." }],
        severity: Severity.LOW,
        recommendations: ["Seek medical attention immediately."],
        confidence: 0
      }
    };
  }
}

export async function analyzePopulationData(cases: Case[]): Promise<EpidemicStatus> {
  const casesSummary = cases.map(c => `ID: ${c.id}, Location: ${c.location.city}, Symptoms: ${c.symptoms.join(", ")}, Desc: ${c.description}`).join("\n");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyse the following patient case data:\n${casesSummary}`,
      config: {
        systemInstruction: "You are a senior computational epidemiologist specializing in early detection. Cluster these cases, assign risk scores, and generate alerts. Generate hypothetical temporal predictions for the next 7 days. Return JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            globalRiskScore: { type: Type.NUMBER },
            activeClusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  center: {
                    type: Type.OBJECT,
                    properties: {
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER }
                    }
                  },
                  casesCount: { type: Type.NUMBER },
                  symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskScore: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["rising", "stable", "declining"] }
                }
              }
            },
            totalCases: { type: Type.NUMBER },
            temporalPrediction: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  expectedCases: { type: Type.NUMBER }
                }
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  location: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "CRITICAL"] },
                  justification: { type: Type.STRING },
                  timestamp: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as EpidemicStatus;
  } catch (error) {
    console.error("Epidemiology AI Error:", error);
    // Return mock fallback data if AI fails
    return {
      globalRiskScore: 12,
      activeClusters: [],
      totalCases: cases.length,
      temporalPrediction: [],
      alerts: []
    };
  }
}
