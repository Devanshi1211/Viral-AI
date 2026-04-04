// Standard API response helpers — consistent format across all routes
import { NextResponse } from "next/server";

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// AI-specific error handler — handles both Kimi (NVIDIA) and Gemini errors
export function handleGeminiError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  // Rate limit / quota exceeded (both NVIDIA and Gemini)
  if (
    message.includes("429") ||
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("too many requests")
  ) {
    return errorResponse(
      "AI quota exceeded. Please wait 30 seconds and try again.",
      429
    );
  }

  // Invalid API key
  if (
    message.includes("401") ||
    message.includes("403") ||
    message.toLowerCase().includes("api key") ||
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("forbidden")
  ) {
    return errorResponse(
      "Invalid AI API key. Check your .env.local file.",
      401
    );
  }

  // Timeout
  if (
    message.toLowerCase().includes("timeout") ||
    message.includes("ECONNABORTED")
  ) {
    return errorResponse(
      "AI request timed out. Please try again.",
      408
    );
  }

  // Model not found
  if (message.toLowerCase().includes("model")) {
    return errorResponse("Invalid model specified.", 400);
  }

  // Network error
  if (
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.toLowerCase().includes("network")
  ) {
    return errorResponse(
      "Cannot connect to AI service. Check your internet connection.",
      503
    );
  }

  // Generic error
  return errorResponse(message, 500);
}
