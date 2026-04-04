// Advanced Hashtag Generator API — returns 100+ categorized hashtags
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
    const topic = body.topic;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const audience = body.audience || "general";
    const contentType = body.contentType || "post";

    const prompt = buildAdvancedHashtagPrompt(topic, audience, contentType);
    const rawText = await generateText(prompt);

    // Extract JSON from AI response (handle markdown code blocks)
    let jsonText = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const objStart = rawText.indexOf("{");
      const objEnd = rawText.lastIndexOf("}");
      if (objStart !== -1 && objEnd !== -1) {
        jsonText = rawText.substring(objStart, objEnd + 1);
      }
    }

    try {
      const parsed = JSON.parse(jsonText);

      // Count total hashtags
      const igCount =
        (parsed.instagram?.viral_high_competition?.length || 0) +
        (parsed.instagram?.medium_competition?.length || 0) +
        (parsed.instagram?.low_competition_niche?.length || 0) +
        (parsed.instagram?.long_tail?.length || 0);
      const ytCount =
        (parsed.youtube?.seo_keywords?.length || 0) +
        (parsed.youtube?.video_tags?.length || 0) +
        (parsed.youtube?.long_tail_keywords?.length || 0) +
        (parsed.youtube?.shorts_tags?.length || 0);
      const twCount =
        (parsed.twitter?.trending?.length || 0) +
        (parsed.twitter?.viral?.length || 0) +
        (parsed.twitter?.conversation?.length || 0) +
        (parsed.twitter?.niche?.length || 0);

      return NextResponse.json({
        success: true,
        data: parsed,
        stats: {
          instagram: igCount,
          youtube: ytCount,
          twitter: twCount,
          total: igCount + ytCount + twCount,
          topViral: parsed.top_viral_overall?.length || 0,
        },
      });
    } catch {
      // If JSON parsing fails, return raw text
      return NextResponse.json({
        success: true,
        raw: rawText,
        parseError: "AI returned non-JSON response. Raw text included.",
      });
    }
  } catch (error: unknown) {
    console.error("Advanced hashtag error:", error);
    return handleGeminiError(error);
  }
}
