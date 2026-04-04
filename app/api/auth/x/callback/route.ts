// Twitter/X OAuth Callback — Exchange code for token
import { NextRequest, NextResponse } from "next/server";
import { exchangeXCode, getXUserInfo } from "@/lib/x";
import { getXCodeVerifier, setXToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  // User denied access
  if (error) {
    return NextResponse.redirect(
      new URL("/settings?error=x_denied", req.url)
    );
  }

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Missing authorization code" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Get stored PKCE verifier
    const codeVerifier = getXCodeVerifier();
    if (!codeVerifier) {
      throw new Error("Missing PKCE code verifier. Please try login again.");
    }

    // Step 2: Exchange code for token
    const tokenData = await exchangeXCode(code, codeVerifier);

    // Step 3: Get user info
    const userInfo = await getXUserInfo(tokenData.access_token);
    const userId = userInfo.data?.id;

    // Step 4: Store token
    setXToken(
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.expires_in,
      userId
    );

    // Redirect to settings with success
    return NextResponse.redirect(
      new URL("/settings?connected=x", req.url)
    );
  } catch (err: unknown) {
    console.error("X OAuth callback error:", err);
    const message = err instanceof Error ? err.message : "Token exchange failed";
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(message)}`, req.url)
    );
  }
}
