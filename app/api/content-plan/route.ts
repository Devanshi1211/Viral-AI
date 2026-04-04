// Content Plan API — uses content optimizer engine
import { NextRequest, NextResponse } from "next/server";
import { optimizeContent } from "@/lib/content-optimizer";
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

    const topic = body.topic || body.niche;
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const platform = body.platform || body.platforms?.[0] || "Instagram";
    const audience = body.audience || "General";
    const tone = body.tone || "engaging";

    const result = await optimizeContent(topic, platform, audience, tone);

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    console.error("Content plan error:", error);
    return handleGeminiError(error);
  }
}
