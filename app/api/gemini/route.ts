// Main Gemini API route — base endpoint for direct prompts
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { promptSchema } from "@/lib/validators";
import { handleGeminiError } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limiter";

// GET — browser me URL open karne pe testing message
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Gemini backend is running. Use POST request with a prompt.",
    endpoints: {
      gemini: "/api/gemini",
      instagramCaptions: "/api/instagram/captions",
      instagramHashtags: "/api/instagram/hashtags",
      youtubeTitles: "/api/youtube/titles",
      youtubeDescriptions: "/api/youtube/descriptions",
      twitterPosts: "/api/twitter/posts",
      trends: "/api/trends",
      contentPlan: "/api/content-plan",
      viralityScore: "/api/virality-score",
    },
  });
}

// POST — frontend se prompt bhejo, Gemini ka answer lo
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

    // Zod validation
    const parsed = promptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { prompt } = parsed.data;
    const text = await generateText(prompt);

    return NextResponse.json({ success: true, text });
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    return handleGeminiError(error);
  }
}
