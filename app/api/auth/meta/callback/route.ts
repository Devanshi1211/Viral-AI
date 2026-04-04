// Meta OAuth Callback — Exchange code for token, discover IG accounts
import { NextRequest, NextResponse } from "next/server";
import { exchangeMetaCode, getLongLivedToken, getUserPages } from "@/lib/meta";
import { setMetaToken, setMetaPageTokens } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  // User denied access
  if (error) {
    return NextResponse.redirect(
      new URL("/settings?error=meta_denied", req.url)
    );
  }

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Missing authorization code" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenData = await exchangeMetaCode(code);
    const shortToken = tokenData.access_token;

    // Step 2: Exchange for long-lived token (60 days)
    const longTokenData = await getLongLivedToken(shortToken);
    const accessToken = longTokenData.access_token || shortToken;
    const expiresIn = longTokenData.expires_in || 3600;

    // Step 3: Store token
    setMetaToken(accessToken, expiresIn);

    // Step 4: Discover Facebook Pages + Instagram Business Accounts
    const pagesData = await getUserPages(accessToken);
    if (pagesData.data && pagesData.data.length > 0) {
      const pageTokens: Record<string, string> = {};
      let igAccountId: string | undefined;

      for (const page of pagesData.data) {
        pageTokens[page.id] = page.access_token;
        if (page.instagram_business_account?.id) {
          igAccountId = page.instagram_business_account.id;
        }
      }

      setMetaPageTokens(pageTokens, igAccountId);
    }

    // Redirect to settings with success
    return NextResponse.redirect(
      new URL("/settings?connected=meta", req.url)
    );
  } catch (err: unknown) {
    console.error("Meta OAuth callback error:", err);
    const message = err instanceof Error ? err.message : "Token exchange failed";
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(message)}`, req.url)
    );
  }
}
