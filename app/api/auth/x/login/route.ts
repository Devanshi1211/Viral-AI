// Twitter/X OAuth Login — Redirects user to X auth page (PKCE flow)
import { NextResponse } from "next/server";
import { getXLoginUrl } from "@/lib/x";
import { setXCodeVerifier } from "@/lib/tokens";
import { env } from "@/lib/env";
import crypto from "crypto";

export async function GET() {
  // Check if X app is configured
  if (!env.X_CLIENT_ID || env.X_CLIENT_ID === "your_x_client_id") {
    return NextResponse.json(
      {
        success: false,
        error: "Twitter/X app not configured. Add X_CLIENT_ID and X_CLIENT_SECRET to .env.local",
        setup_url: "https://developer.x.com/",
      },
      { status: 503 }
    );
  }

  // Generate PKCE code verifier + state
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const state = crypto.randomBytes(16).toString("hex");

  // Store verifier for callback
  setXCodeVerifier(codeVerifier);

  // For "plain" method, challenge = verifier
  const loginUrl = getXLoginUrl(state, codeVerifier);
  return NextResponse.redirect(loginUrl);
}
