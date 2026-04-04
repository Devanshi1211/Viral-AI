// YouTube Thumbnail Analysis & Suggestions API
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
    const { videoTitle, description = "", niche = "general" } = body;

    if (!videoTitle) {
      return NextResponse.json(
        { success: false, error: "Video title is required" },
        { status: 400 }
      );
    }

    // Generate thumbnail suggestions and improvements
    const prompt = `You are a professional YouTube thumbnail designer and content strategist with expertise in creating high-CTR thumbnails.

Analyze and provide detailed suggestions for improving a YouTube thumbnail:

Video Title: ${videoTitle}
Video Description: ${description}
Niche: ${niche}

Provide your analysis in this exact format:

**Thumbnail Score:** (1-10)

**Key Elements to Include:**
1. [Element 1]
2. [Element 2]
3. [Element 3]
4. [Element 4]
5. [Element 5]

**Improvement Suggestions:**
1. [First improvement]
2. [Second improvement]
3. [Third improvement]
4. [Fourth improvement]
5. [Fifth improvement]

**Color Scheme Recommendations:**
- Primary Color: [Color recommendation]
- Secondary Color: [Color recommendation]
- Why: [Reason based on psychology and niche trends]

**Text Elements to Add:**
- Main Text: [Suggested text]
- Font Style: [Recommendation]
- Text Position: [Position recommendation]

**CTR Optimization Tips:**
- [Tip 1]
- [Tip 2]
- [Tip 3]
- [Tip 4]

**Emotional Appeal:**
- [Emotion to trigger 1]
- [Emotion to trigger 2]
- [Emotion to trigger 3]

**Contrast & Clarity:**
- Visibility at small sizes (YouTube thumbnail dimensions)
- Stand out from similar videos in the niche
- Mobile-friendly design

Make the suggestions specific, actionable, and based on current YouTube trends and what performs best.`;

    const suggestions = await generateText(prompt);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error: unknown) {
    console.error("YouTube thumbnail analysis error:", error);
    return handleGeminiError(error);
  }
}
