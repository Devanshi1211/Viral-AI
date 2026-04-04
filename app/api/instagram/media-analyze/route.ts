// Instagram Media Analysis & Suggestions API
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
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
    const { description, contentType = "post", mediaType = "image", niche = "general" } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    // Generate suggestions for the post/reel
    const prompt = `You are a professional Instagram content strategist with expertise in creating viral posts and reels.

Analyze this Instagram content and provide detailed suggestions:

Content Type: ${contentType}
Media Type: ${mediaType}
Niche: ${niche}
Description: ${description}

Provide your analysis in this exact format:

**Content Quality Score:** (1-10)

**Suggestions for Improvement:**
1. [First suggestion]
2. [Second suggestion]
3. [Third suggestion]
4. [Fourth suggestion]
5. [Fifth suggestion]

**Best Time to Post:** [Optimal posting time]

**Estimated Reach:** [Estimated reach percentage]

**Engagement Tips:**
- [Tip 1]
- [Tip 2]
- [Tip 3]

**Caption Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

**Hashtag Strategy:**
- Use 20-30 hashtags
- Mix of trending, popular, and niche hashtags
- Place hashtags in first comment for cleaner look

Make the suggestions specific, actionable, and based on current Instagram trends.`;

    const suggestions = await generateText(prompt);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error: unknown) {
    console.error("Instagram media analysis error:", error);
    return handleGeminiError(error);
  }
}
