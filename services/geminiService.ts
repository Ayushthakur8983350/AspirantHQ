
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, HistoryEvent, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFormattedToday = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

// Simple deterministic hash for IDs based on title string
const generateId = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `intel-${Math.abs(hash).toString(36)}`;
};

export const fetchCurrentAffairs = async (categoryFilter: string = "All", offset: number = 0): Promise<{ items: NewsItem[]; rawText: string }> => {
  const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const prompt = `
    MISSION CRITICAL: High-volume tactical intelligence scan for UPSC/CDS/AFCAT 2026.
    SCOPE: DEEP SCAN (Offset: ${offset})
    CATEGORY: ${categoryFilter}
    
    INSTRUCTION: 
    1. Return exactly 50 distinct intelligence briefs.
    2. Focus on strategic developments, geopolitical shifts, and national security updates.
    3. Ensure each brief is concise, exam-focused, and unique.
    4. If offset is 0, prioritize the most recent 24-48 hours. If offset > 0, scan deeper into the monthly strategic archives.

    Format each item exactly as:
    ---
    TITLE: [Strategic Headline]
    CATEGORY: [Category]
    SUMMARY: [2-3 sentence strategic brief for competitive exams]
    DATE: ${todayDate}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.15
      },
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks.map((c: any) => c.web).filter(Boolean);

    const items: NewsItem[] = text.split('---').filter(part => part.includes('TITLE:')).map((part, index) => {
      const titleMatch = part.match(/TITLE:\s*(.*)/);
      const categoryMatch = part.match(/CATEGORY:\s*(.*)/);
      const summaryMatch = part.match(/SUMMARY:\s*(.*)/);
      
      const title = titleMatch ? titleMatch[1].trim() : "Tactical Update";

      return {
        id: generateId(title),
        title: title,
        category: (categoryMatch ? categoryMatch[1].trim() : "Miscellaneous") as any,
        summary: summaryMatch ? summaryMatch[1].trim() : "Gathering additional intelligence...",
        date: todayDate,
        sources: webSources.slice(index % 5, (index % 5) + 1),
      };
    });

    return { items, rawText: text };
  } catch (error) {
    console.error("Critical: Strategic Data Link Failure", error);
    throw error;
  }
};

export interface HistoryPackage {
  events: HistoryEvent[];
  significance: {
    summary: string;
    whyItMatters: string;
    examPillars: string[];
  };
}

export const fetchHistoryToday = async (): Promise<HistoryPackage> => {
  const todayDate = getFormattedToday();
  const prompt = `
    Analyze the date ${todayDate} for UPSC/CDS 2026 aspirants.
    
    PART 1: Retrieve 50 significant historical events for ${todayDate}. 
    PART 2: Provide a 'Strategic Significance' analysis of this date.
    
    Return in JSON format.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.STRING },
                  description: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["title", "year", "description", "relevance", "category"]
              }
            },
            significance: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "A 2-sentence tactical summary of today's historical importance." },
                whyItMatters: { type: Type.STRING, description: "Deep analysis for UPSC/CDS students." },
                examPillars: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 bullet points on exam focus areas." }
              },
              required: ["summary", "whyItMatters", "examPillars"]
            }
          },
          required: ["events", "significance"]
        }
      },
    });
    return JSON.parse(response.text.trim());
  } catch (error) { 
    return { 
      events: [], 
      significance: { 
        summary: "Data link intermittent.", 
        whyItMatters: "Unable to synthesize significance at this time.", 
        examPillars: [] 
      } 
    }; 
  }
};

export const fetchDailyDrill = async (): Promise<QuizQuestion[]> => {
  const today = getFormattedToday();
  const prompt = `Generate 5 high-yield MCQs for UPSC 2026 based on ${today} developments. JSON format.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim()).map((q: any, i: number) => ({ id: `q-${Date.now()}-${i}`, ...q }));
  } catch (error) { return []; }
};

export const searchArchives = async (query: string, dateRange: string = 'Today'): Promise<NewsItem[]> => {
  const prompt = `High-precision search for: "${query}". Temporal scope: ${dateRange}. Format: ---TITLE:...CATEGORY:...SUMMARY:...DATE:...---`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text || "";
    return text.split('---').filter(part => part.includes('TITLE:')).map((part, index) => {
      const titleMatch = part.match(/TITLE:\s*(.*)/);
      const categoryMatch = part.match(/CATEGORY:\s*(.*)/);
      const summaryMatch = part.match(/SUMMARY:\s*(.*)/);
      const dateMatch = part.match(/DATE:\s*(.*)/);
      const title = titleMatch ? titleMatch[1].trim() : "Archive Intel";
      return {
        id: generateId(title),
        title: title,
        category: (categoryMatch ? categoryMatch[1].trim() : "Miscellaneous") as any,
        summary: summaryMatch ? summaryMatch[1].trim() : "Data retrieval...",
        date: dateMatch ? dateMatch[1].trim() : "Today",
        sources: [],
      };
    });
  } catch (error) { return []; }
};
