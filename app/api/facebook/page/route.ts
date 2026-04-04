// Facebook Page Data Route — fetch page info, posts
import { NextRequest, NextResponse } from "next/server";
import { getPageDetails } from "@/lib/meta";
import { getMetaToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("page_id");
  const accessToken = getMetaToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Not connected to Facebook. Please connect via Settings.",
      },
      { status: 401 }
    );
  }

  if (!pageId) {
    return NextResponse.json(
      { success: false, error: "page_id query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const data = await getPageDetails(pageId, accessToken);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("Facebook page error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch page data";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
