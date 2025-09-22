
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsItem } from '../types.ts';

// This service encapsulates all interactions with the Google Gemini API.
// Educational note: A dedicated service layer for external APIs is a key principle
// of good software architecture. It centralizes API logic, making the app easier
// to maintain and test.

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a detailed financial report for a given stock symbol using a streaming response.
 * @param stockSymbol The stock symbol (e.g., 'AAPL').
 * @returns An async generator that yields chunks of the report content.
 * Educational note: Streaming responses provide a much better user experience for long-running
 * generative tasks. Users see content appearing immediately instead of waiting for the full response.
 */
export async function* generateFinancialReportStream(stockSymbol: string) {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Generate a comprehensive financial analysis report for the stock symbol: ${stockSymbol}.
    The report should be well-structured, easy to read, and suitable for an educational context for a new trader.
    Format the output in Markdown.

    Please include the following sections, using '###' for each section title:

    ### 1. Company Introduction
    - A brief, engaging overview of the company, its business model, and its industry.

    ### 2. Simplified Financial Analysis
    - Discuss key metrics like P/E Ratio, Revenue Growth, and Net Income in simple terms.
    - Explain what these metrics mean for a potential investor.

    ### 3. Recent Performance & Market Position
    - Briefly touch on the stock's performance over the last year.
    - Mention its key competitors and its position in the market.

    ### 4. Key Takeaways & Potential Risks
    - Summarize the main points in a bulleted list.
    - Mention 2-3 potential risks investors should be aware of, explaining them simply.
  `;

  const response = await ai.models.generateContentStream({
    model,
    contents: prompt,
  });

  for await (const chunk of response) {
    yield chunk.text;
  }
}

/**
 * Analyzes a list of news headlines, providing a summary and sentiment for each.
 * @param headlines An array of raw news headlines.
 * @returns A promise that resolves to an array of NewsItem objects.
 * Educational note: This demonstrates a powerful use case of LLMs - batch processing
 * and structuring unstructured data. The responseSchema ensures we get back clean,
 * usable JSON without manual parsing.
 */
export async function analyzeNews(headlines: {headline: string, source: string}[]): Promise<NewsItem[]> {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Analyze the following list of financial news headlines. For each headline, provide:
    1. A concise, one-sentence summary.
    2. A sentiment analysis: 'Positive', 'Negative', or 'Neutral'.

    Headlines:
    ${headlines.map(h => `- ${h.headline}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalHeadline: { type: Type.STRING },
              summary: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] },
            }
          }
        },
      }
    });

    const parsedResponse = JSON.parse(response.text);

    // Match the analyzed data back to the original headlines with sources
    return parsedResponse.map((analyzed: any) => {
        const original = headlines.find(h => h.headline === analyzed.originalHeadline);
        return {
            headline: analyzed.originalHeadline,
            summary: analyzed.summary,
            sentiment: analyzed.sentiment,
            source: original ? original.source : 'Unknown',
        };
    });

  } catch (error) {
    console.error("Error analyzing news with Gemini:", error);
    // Return a fallback error message within the structure
    return headlines.map(h => ({
        ...h,
        summary: 'Could not analyze summary.',
        sentiment: 'Neutral',
    }));
  }
}