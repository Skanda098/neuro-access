import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Updated fallback chain incorporating current flagship and previous 3.x Flash models
const FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.8-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite'
];

// Utility function to strip Markdown symbols for clean Text-to-Speech playback
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '')            // Remove heading symbols (###)
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1') // Remove bold/italics (**text**, *text*)
    .replace(/^[\*\-\+]\s+/gm, '')       // Remove bullet point symbols
    .replace(/^---\s*$/gm, '')           // Remove horizontal dividers
    .replace(/[`~_]/g, '')               // Remove backticks, underscores, strikethrough
    .replace(/\n{3,}/g, '\n\n')          // Normalize line breaks
    .trim();
};

// Helper function with fallback execution across the Gemini 3.x suite
const generateContentWithFallback = async (prompt) => {
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`--- Calling Gemini API (${modelName}) ---`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });
      console.log(`--- Gemini successfully responded using ${modelName} ---`);
      return response.text;
    } catch (error) {
      console.warn(`⚠️ Endpoint ${modelName} unavailable or failed (${error.message}). Trying fallback model...`);
    }
  }
  throw new Error('All Gemini model endpoints failed or experienced high demand. Please try again.');
};

export const simplifyTextContent = async (paragraphs) => {
  try {
    const rawText = paragraphs.join('\n\n');

    const prompt = `You are a supportive, high-clarity accessibility assistant designed for neurodivergent readers (ADHD, Dyslexia, and cognitive fatigue).

Rephrase and restructure the following article content into natural, clear paragraphs.

CRITICAL FORMATTING INSTRUCTIONS:
- DO NOT use any Markdown syntax. 
- DO NOT use hashtags (# or ###), asterisks (* or **), bullet points (- or *), or horizontal lines (---).
- Write in plain, conversational sentences and normal paragraphs only.
- The output will be read aloud by a text-to-speech engine, so ensure it sounds like a smooth, friendly spoken conversation.

Original Text:
${rawText}`;

    const textResult = await generateContentWithFallback(prompt);
    const cleanedText = stripMarkdown(textResult);
    return cleanedText.split('\n\n').filter((p) => p.trim().length > 0);
  } catch (error) {
    console.error('⚠️ Gemini API Error:', error.message);
    return paragraphs.map((p) => stripMarkdown(p));
  }
};

export const generateImageDescription = async (imageUrl) => {
  try {
    const prompt = `Describe this image in 2 concise, plain-text sentences for a user listening via an audio assistant. Do NOT use markdown symbols or formatting. Image URL: ${imageUrl}`;
    
    const textResult = await generateContentWithFallback(prompt);
    return stripMarkdown(textResult.trim());
  } catch (error) {
    console.error('⚠️ Gemini Vision Error:', error.message);
    return 'An illustrative image from the article.';
  }
};