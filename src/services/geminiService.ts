import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PrescriptionDrug {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  confidence: number;
}

export interface ScanResult {
  drugs: PrescriptionDrug[];
  interactions: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    drugs_involved: string[];
  }[];
  risk_score: number;
  raw_text: string;
}

export const geminiService = {
  async scanPrescription(base64Image: string, mimeType: string, sourceLanguage: string = "English"): Promise<ScanResult> {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Analyze this prescription image. The prescription is written in ${sourceLanguage}.
      1. Extract all drugs, their dosages, frequencies, and durations.
      2. Identify any potential drug-drug interactions between the prescribed medications.
      3. Assign a risk score from 0-100 (0 being safe, 100 being extremely dangerous).
      4. Provide the raw text extracted.
      
      Return the result in JSON format.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            drugs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ["name", "dosage", "frequency"]
              }
            },
            interactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  description: { type: Type.STRING },
                  drugs_involved: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            risk_score: { type: Type.NUMBER },
            raw_text: { type: Type.STRING }
          },
          required: ["drugs", "interactions", "risk_score", "raw_text"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async translateInstructions(text: string, targetLanguage: string): Promise<string> {
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Translate the following medical instructions into ${targetLanguage}. Ensure medical accuracy and use clear, patient-friendly language. 
      
      Instructions:
      ${text}`,
    });
    return response.text || "";
  },

  async getDrugInfo(drugName: string): Promise<string> {
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Provide a brief, patient-friendly overview of the drug ${drugName}. Include its primary use, common side effects, and any important warnings. Use Google Search for the most up-to-date information.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "";
  },

  async deepAnalyze(prescriptionText: string): Promise<string> {
    const model = "gemini-3.1-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Perform a deep clinical analysis of this prescription:
      
      ${prescriptionText}
      
      Analyze for:
      1. Potential contraindications based on common medical conditions.
      2. Optimal timing for each medication.
      3. Lifestyle or dietary recommendations while on these medications.
      4. Red flags that would require immediate medical attention.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return response.text || "";
  },

  async generateSpeech(text: string): Promise<string> {
    const model = "gemini-2.5-flash-preview-tts";
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Read these medical instructions clearly and calmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  },

  async reviewTranslation(originalText: string, translatedText: string, targetLanguage: string): Promise<{ verified: boolean, correctedText: string, notes: string }> {
    const model = "gemini-3.1-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `You are a medical translation expert. Review the following translation for medical accuracy and clarity in ${targetLanguage}.
      
      Original English Instructions:
      ${originalText}
      
      Translated Instructions (${targetLanguage}):
      ${translatedText}
      
      Verify that:
      1. Drug names and dosages are identical to the original.
      2. Frequency and timing instructions are correctly translated.
      3. The language is culturally appropriate and patient-friendly.
      
      If the translation is perfect, return it as is. If there are errors, provide the corrected version.
      Return the result in JSON format.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verified: { type: Type.BOOLEAN },
            correctedText: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
          required: ["verified", "correctedText", "notes"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async checkDrugInteractions(drugs: PrescriptionDrug[]): Promise<ScanResult['interactions']> {
    const model = "gemini-3.1-pro-preview";
    const drugList = drugs.map(d => `${d.name} (${d.dosage})`).join(", ");
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze potential drug-drug interactions for the following medications: ${drugList}. 
      Perform a deep clinical check for any known interactions, contraindications, or safety warnings.
      Return the results in JSON format with severity (low, medium, high, critical), description, and drugs_involved.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
              description: { type: Type.STRING },
              drugs_involved: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["severity", "description", "drugs_involved"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  }
};
