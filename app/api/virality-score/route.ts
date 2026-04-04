// Virality Score API — uses the prediction engine for data-driven scoring
import { NextRequest, NextResponse } from "next/server";
import { predictVirality } from "@/lib/virality-engine";
import { generateText } from "@/lib/gemini";
import { buildViralityPrompt } from "@/lib/prompts";
import { handleGeminiError } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mode 1: ML-style prediction with numeric inputs
    if (body.likes !== undefined || body.engagementRate !== undefined) {
      const input = {
        likes: Number(body.likes) || 0,
        comments: Number(body.comments) || 0,
        shares: Number(body.shares) || 0,
        watchTime: Number(body.watchTime) || 0,
        captionLength: Number(body.captionLength) || 100,
        hashtagsCount: Number(body.hashtagsCount) || 5,
        postingHour: Number(body.postingHour) || 18,
        engagementRate: Number(body.engagementRate) || 0,
      };

      const result = predictVirality(input);
      return NextResponse.json({ success: true, ...result });
    }

    // Mode 2: AI-powered analysis with topic text
    if (body.topic) {
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

      const prompt = buildViralityPrompt(body.topic, body.platform || "Instagram");
      const text = await generateText(prompt);
      return NextResponse.json({ success: true, text });
    }

    return NextResponse.json(
      { success: false, error: "Provide either numeric metrics or a topic for analysis" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Virality score error:", error);
    return handleGeminiError(error);
  }
}
