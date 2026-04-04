// Instagram Account Data Route — fetch profile, media, insights
import { NextRequest, NextResponse } from "next/server";
import { getInstagramAccount, getInstagramMedia, getInstagramInsights } from "@/lib/meta";
import { getMetaToken, getIgAccountId } from "@/lib/tokens";

// GET — fetch Instagram business account info
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "profile";
  const accessToken = getMetaToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Not connected to Instagram. Please connect via Settings.",
      },
      { status: 401 }
    );
  }

  const igAccountId = getIgAccountId();
  if (!igAccountId) {
    return NextResponse.json(
      {
        success: false,
        error: "No Instagram Business Account found. Make sure your Instagram is linked to a Facebook Page.",
      },
      { status: 404 }
    );
  }

  try {
    switch (action) {
      case "media": {
        const media = await getInstagramMedia(igAccountId, accessToken);
        return NextResponse.json({ success: true, data: media });
      }
      case "insights": {
        const insights = await getInstagramInsights(igAccountId, accessToken);
        return NextResponse.json({ success: true, data: insights });
      }
      case "profile":
      default: {
        // Get account via any stored page
        return NextResponse.json({
          success: true,
          data: { igAccountId, message: "Instagram Business Account connected" },
        });
      }
    }
  } catch (err: unknown) {
    console.error("Instagram account error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch Instagram data";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
