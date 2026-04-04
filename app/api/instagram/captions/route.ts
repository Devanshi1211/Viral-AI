// Instagram Caption Generator API
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildInstagramCaptionPrompt } from "@/lib/prompts";
import { instagramCaptionSchema } from "@/lib/validators";
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

    const parsed = instagramCaptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { topic, tone } = parsed.data;
    const prompt = buildInstagramCaptionPrompt(topic, tone);
    const text = await generateText(prompt);

    return NextResponse.json({ success: true, text });
  } catch (error: unknown) {
    console.error("Instagram caption error:", error);
    return handleGeminiError(error);
  }
}
