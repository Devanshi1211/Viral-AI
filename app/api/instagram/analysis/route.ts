// Instagram Analysis API — analytics from dataset
import { NextResponse } from "next/server";
import { instagramData, formatCount } from "@/lib/dataset-loader";

export async function GET() {
  try {
    const posts = instagramData.posts;

    // Aggregate metrics
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.comments, 0);
    const totalShares = posts.reduce((s, p) => s + p.shares, 0);
    const avgEngagement = ((totalLikes + totalComments + totalShares) / posts.length / 10000 * 100);

    // Top posts by engagement
    const topPosts = [...posts]
      .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
      .slice(0, 5)
      .map((p) => ({
        title: p.caption,
        likes: p.likes,
        comments: p.comments,
        shares: p.shares,
        engagementRate: parseFloat(((p.likes + p.comments + p.shares) / 10000 * 100).toFixed(1)),
        type: p.type,
      }));

    // Engagement by content type
    const typeMap: Record<string, { engagement: number; reach: number; count: number }> = {};
    for (const post of posts) {
      if (!typeMap[post.type]) typeMap[post.type] = { engagement: 0, reach: 0, count: 0 };
      typeMap[post.type].engagement += post.likes + post.comments + post.shares;
      typeMap[post.type].reach += (post.likes + post.comments + post.shares) * 4;
      typeMap[post.type].count += 1;
    }

    const contentTypes = Object.entries(typeMap).map(([type, data]) => ({
      type,
      engagement: Math.round(data.engagement / data.count),
      reach: Math.round(data.reach / data.count),
    }));

    // Weekly engagement trend
    const trends = [
      { date: "Jan 1", likes: 2400, comments: 520, shares: 840 },
      { date: "Jan 8", likes: 3100, comments: 650, shares: 920 },
      { date: "Jan 15", likes: 4500, comments: 890, shares: 1400 },
      { date: "Jan 22", likes: 5200, comments: 1200, shares: 2100 },
      { date: "Jan 29", likes: 6100, comments: 1500, shares: 2800 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        platform: "Instagram",
        metrics: {
          totalPosts: posts.length,
          totalLikes,
          totalComments,
          totalShares,
          avgLikes: Math.round(totalLikes / posts.length),
          avgComments: Math.round(totalComments / posts.length),
          avgShares: Math.round(totalShares / posts.length),
          avgEngagementRate: parseFloat(avgEngagement.toFixed(1)),
          totalReach: (totalLikes + totalComments + totalShares) * 4,
        },
        topPosts,
        contentTypes,
        trends,
        formattedMetrics: {
          totalLikes: formatCount(totalLikes),
          totalComments: formatCount(totalComments),
          totalShares: formatCount(totalShares),
          avgEngagement: `${avgEngagement.toFixed(1)}%`,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Instagram analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze Instagram data" },
      { status: 500 }
    );
  }
}
