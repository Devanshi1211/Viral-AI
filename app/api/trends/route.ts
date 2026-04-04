// Trends API — uses trend engine + optional AI analysis
import { NextRequest, NextResponse } from "next/server";
import { getFullTrendAnalysis, getTopHashtags } from "@/lib/trend-engine";
import { generateText } from "@/lib/gemini";
import { buildTrendAnalysisPrompt } from "@/lib/prompts";
import { handleGeminiError } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limiter";

// GET — return data-driven trend analysis (no AI needed)
export async function GET() {
  try {
    const analysis = getFullTrendAnalysis();
    return NextResponse.json({ success: true, ...analysis });
  } catch (error: unknown) {
    console.error("Trends GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load trend data" },
      { status: 500 }
    );
  }
}

// POST — AI-enhanced trend analysis for a specific niche
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
    const niche = body.niche || "social media";

    // Data-driven base analysis
    const dataAnalysis = getFullTrendAnalysis();

    // AI-enhanced insights
    const prompt = buildTrendAnalysisPrompt(niche);
    const text = await generateText(prompt);

    return NextResponse.json({
      success: true,
      text,
      ...dataAnalysis,
    });
  } catch (error: unknown) {
    console.error("Trends POST error:", error);
    return handleGeminiError(error);
  }
}
