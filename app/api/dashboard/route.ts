// Dashboard API — returns real metrics for overview cards
import { NextResponse } from "next/server";
import { getDashboardMetrics, getTopHashtags } from "@/lib/trend-engine";

export async function GET() {
  try {
    const metrics = getDashboardMetrics();
    const topHashtags = getTopHashtags("all", 6);

    return NextResponse.json({
      success: true,
      metrics,
      topHashtags,
    });
  } catch (error: unknown) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
