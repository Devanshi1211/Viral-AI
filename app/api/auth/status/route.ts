// Connection Status + Disconnect API
import { NextRequest, NextResponse } from "next/server";
import {
  getConnectionStatus,
  disconnectMeta,
  disconnectX,
} from "@/lib/tokens";
import { env } from "@/lib/env";

// GET — check which platforms are connected
export async function GET() {
  const status = getConnectionStatus();

  return NextResponse.json({
    success: true,
    connections: {
      instagram: {
        connected: status.meta,
        configured: !!env.META_APP_ID && env.META_APP_ID !== "your_meta_app_id",
      },
      facebook: {
        connected: status.meta,
        configured: !!env.META_APP_ID && env.META_APP_ID !== "your_meta_app_id",
      },
      twitter: {
        connected: status.x,
        configured: !!env.X_CLIENT_ID && env.X_CLIENT_ID !== "your_x_client_id",
      },
    },
  });
}

// POST — disconnect a platform
export async function POST(req: NextRequest) {
  try {
    const { platform } = await req.json();

    switch (platform) {
      case "meta":
      case "instagram":
      case "facebook":
        disconnectMeta();
        return NextResponse.json({
          success: true,
          message: "Disconnected from Instagram/Facebook",
        });
      case "x":
      case "twitter":
        disconnectX();
        return NextResponse.json({
          success: true,
          message: "Disconnected from Twitter/X",
        });
      default:
        return NextResponse.json(
          { success: false, error: "Unknown platform" },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Disconnect failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
