// Twitter/X Account Data Route — fetch user info, tweets
import { NextRequest, NextResponse } from "next/server";
import { getXUserInfo, getXUserTweets } from "@/lib/x";
import { getXToken, getXUserId } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "profile";
  const accessToken = getXToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Not connected to Twitter/X. Please connect via Settings.",
      },
      { status: 401 }
    );
  }

  try {
    switch (action) {
      case "tweets": {
        const userId = getXUserId();
        if (!userId) {
          return NextResponse.json(
            { success: false, error: "User ID not found. Reconnect your account." },
            { status: 400 }
          );
        }
        const tweets = await getXUserTweets(userId, accessToken);
        return NextResponse.json({ success: true, data: tweets });
      }
      case "profile":
      default: {
        const userInfo = await getXUserInfo(accessToken);
        return NextResponse.json({ success: true, data: userInfo });
      }
    }
  } catch (err: unknown) {
    console.error("Twitter account error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch X data";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
