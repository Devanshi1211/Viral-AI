// Instagram Viral Hashtag Generator API
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildAdvancedHashtagPrompt } from "@/lib/prompts";
import { handleGeminiError } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 38 requests per minute per IP
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const limitResult = rateLimit(clientIP, 38, 60000);

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Try again in ${Math.ceil(limitResult.resetIn / 1000)} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { topic, audience = "general", contentType = "post" } = body;

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = buildAdvancedHashtagPrompt(topic, audience, contentType);
    const text = await generateText(prompt);

    try {
      const hashtagData = JSON.parse(text);
      return NextResponse.json({ success: true, data: hashtagData });
    } catch {
      return NextResponse.json({
        success: true,
        data: { raw: text },
        warning: "Could not parse as JSON",
      });
    }
  } catch (error: unknown) {
    console.error("Instagram viral hashtags error:", error);
    return handleGeminiError(error);
  }
}
