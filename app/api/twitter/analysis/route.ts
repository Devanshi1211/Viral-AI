// Twitter/X Analysis API — analytics from dataset
import { NextResponse } from "next/server";
import { twitterData, formatCount } from "@/lib/dataset-loader";

export async function GET() {
  try {
    const tweets = twitterData.tweets;

    const totalLikes = tweets.reduce((s, t) => s + t.likes, 0);
    const totalRetweets = tweets.reduce((s, t) => s + t.retweets, 0);
    const totalReplies = tweets.reduce((s, t) => s + t.replies, 0);

    const topTweets = [...tweets]
      .sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets))
      .slice(0, 5)
      .map((t) => ({
        text: t.text,
        likes: t.likes,
        retweets: t.retweets,
        replies: t.replies,
        engagementRate: parseFloat(((t.likes + t.retweets + t.replies) / 100000 * 100).toFixed(2)),
      }));

    return NextResponse.json({
      success: true,
      data: {
        platform: "Twitter/X",
        metrics: {
          totalTweets: tweets.length,
          totalLikes,
          totalRetweets,
          totalReplies,
          avgLikes: Math.round(totalLikes / tweets.length),
          avgRetweets: Math.round(totalRetweets / tweets.length),
          avgEngagementRate: parseFloat(((totalLikes + totalRetweets + totalReplies) / (tweets.length * 100000) * 100).toFixed(2)),
        },
        topTweets,
        formattedMetrics: {
          totalLikes: formatCount(totalLikes),
          totalRetweets: formatCount(totalRetweets),
          totalReplies: formatCount(totalReplies),
        },
      },
    });
  } catch (error: unknown) {
    console.error("Twitter analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze Twitter data" },
      { status: 500 }
    );
  }
}
