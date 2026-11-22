import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      body.likes === undefined &&
      body.engagementRate === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Provide numeric metrics for prediction"
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "http://127.0.0.1:8002/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: Number(body.likes) || 0,
          comments: Number(body.comments) || 0,
          shares: Number(body.shares) || 0,
          watchTime: Number(body.watchTime) || 0,
          captionLength: Number(body.captionLength) || 100,
          hashtagsCount: Number(body.hashtagsCount) || 5,
          postingHour: Number(body.postingHour) || 18,
          engagementRate: Number(body.engagementRate) || 0
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "ML service returned an error"
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    return NextResponse.json(result);

  } catch (error) {
    console.error("Virality ML error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "ML service unavailable. Make sure FastAPI is running on port 8002."
      },
      { status: 503 }
    );
  }
}
