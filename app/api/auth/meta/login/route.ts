// Meta OAuth Login — Redirects user to Facebook/Instagram auth page
import { NextResponse } from "next/server";
import { getMetaLoginUrl } from "@/lib/meta";
import { env } from "@/lib/env";

export async function GET() {
  // Check if Meta app is configured
  if (!env.META_APP_ID || env.META_APP_ID === "your_meta_app_id") {
    return NextResponse.json(
      {
        success: false,
        error: "Meta app not configured. Add META_APP_ID and META_APP_SECRET to .env.local",
        setup_url: "https://developers.facebook.com/apps/",
      },
      { status: 503 }
    );
  }

  const loginUrl = getMetaLoginUrl();
  return NextResponse.redirect(loginUrl);
}
