// AI Service — Kimi K2.5 (NVIDIA) as primary, Gemini as fallback
import axios from "axios";
import { env } from "@/lib/env";
import { cleanText } from "@/lib/formatters";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Generate text using Kimi K2.5 via NVIDIA API
 * OpenAI-compatible chat completions format
 */
async function generateWithKimi(prompt: string): Promise<string> {
  const response = await axios.post(
    NVIDIA_URL,
    {
      model: "moonshotai/kimi-k2.5",
      messages: [
        {
          role: "system",
          content:
            "You are a viral content strategist and social media expert. Always respond with clean, well-formatted text. No markdown headers unless asked.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1.0,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 60000, // 60 second timeout — Kimi can be slow on first requests
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Kimi returned empty response");
  }

  return content;
}

/**
 * Fallback: Generate text using Gemini (if NVIDIA key is missing)
 */
async function generateWithGemini(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Main function — tries Kimi first, falls back to Gemini
 * All routes in the project use this single function
 */
export async function generateText(prompt: string): Promise<string> {
  let raw: string;

  if (env.NVIDIA_API_KEY) {
    try {
      // Primary: Kimi K2.5
      raw = await generateWithKimi(prompt);
    } catch (kimiError) {
      console.warn("Kimi failed, falling back to Gemini:", kimiError instanceof Error ? kimiError.message : kimiError);
      if (env.GEMINI_API_KEY) {
        raw = await generateWithGemini(prompt);
      } else {
        throw kimiError;
      }
    }
  } else if (env.GEMINI_API_KEY) {
    // Fallback: Gemini
    raw = await generateWithGemini(prompt);
  } else {
    throw new Error("No AI API key configured");
  }

  return cleanText(raw);
}

// Re-export for backward compatibility (some routes may use this)
export function getGeminiModel() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}
